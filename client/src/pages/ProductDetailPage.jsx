import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorState from '../components/common/ErrorState.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import MarkdownContent from '../components/MarkdownContent.jsx'
import {
  addFavorite,
  generateAiProductReport,
  getCachedProductById,
  getProductById,
} from '../services/api'
import {
  formatMoney,
  formatNumber,
  formatPercent,
  formatRating,
  formatScore,
  formatText,
} from '../utils/format'
import {
  getProductCategory,
  getProductImage,
  getProductName,
  getProductTags,
  getRiskFactors,
  getRiskLevelText,
} from '../utils/product'
import { buildBasicProductReport, getReportSourceLabel } from '../utils/productReport'

function DecisionMetric({ label, value, tone = '' }) {
  const metricClassName = tone
    ? `detail-page__decision-metric detail-page__decision-metric--${tone}`
    : 'detail-page__decision-metric'

  return (
    <div className={metricClassName}>
      <span className="detail-page__decision-label">{label}</span>
      <strong className="detail-page__decision-value">{value}</strong>
    </div>
  )
}

function DetailItem({ label, value, tone = '' }) {
  const itemClassName = tone ? `detail-page__item detail-page__item--${tone}` : 'detail-page__item'

  return (
    <div className={itemClassName}>
      <dt className="detail-page__label">{label}</dt>
      <dd className="detail-page__value">{value}</dd>
    </div>
  )
}

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageLoadError, setImageLoadError] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [favoriteMessage, setFavoriteMessage] = useState('')
  const [favoriteMessageType, setFavoriteMessageType] = useState('')
  const [aiReport, setAiReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState('')
  const reportAbortControllerRef = useRef(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchProductDetail() {
      setLoading(true)
      setError('')
      const cachedProduct = getCachedProductById(id)
      setProduct(cachedProduct)
      setLoading(!cachedProduct)
      setImageLoadError(false)
      setFavoriteMessage('')
      setFavoriteMessageType('')
      setFavoriteLoading(false)
      setAiReport('')
      setReportError('')
      setReportLoading(false)
      reportAbortControllerRef.current?.abort()
      reportAbortControllerRef.current = null

      try {
        const productData = await getProductById(id, { signal: abortController.signal })
        setProduct(productData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          if (!cachedProduct) {
            setError(requestError.message || '获取商品详情失败')
          }
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProductDetail()

    return () => {
      abortController.abort()
      reportAbortControllerRef.current?.abort()
    }
  }, [id])

  async function handleAddFavorite() {
    if (!product?.id || favoriteLoading) {
      return
    }

    setFavoriteLoading(true)
    setFavoriteMessage('')
    setFavoriteMessageType('')

    try {
      const result = await addFavorite(product.id)
      setFavoriteMessage(result.message || '已加入候选池')
      setFavoriteMessageType('success')
    } catch (requestError) {
      setFavoriteMessage(requestError.message || '添加候选商品失败')
      setFavoriteMessageType('error')
    } finally {
      setFavoriteLoading(false)
    }
  }

  async function handleGenerateAiReport() {
    if (!product?.id || reportLoading) {
      return
    }

    reportAbortControllerRef.current?.abort()
    const abortController = new AbortController()
    reportAbortControllerRef.current = abortController

    setReportLoading(true)
    setReportError('')

    try {
      const result = await generateAiProductReport(product.id, {
        signal: abortController.signal,
      })
      setAiReport(result.report)
    } catch (requestError) {
      if (requestError.name === 'AbortError') {
        return
      }

      setAiReport('')
      setReportError('AI 深度报告暂时不可用，已为你展示基础选品报告，请稍后重试。')
    } finally {
      if (reportAbortControllerRef.current === abortController) {
        reportAbortControllerRef.current = null
        setReportLoading(false)
      }
    }
  }

  const productImage = getProductImage(product, imageLoadError)
  const tags = getProductTags(product)
  const riskFactors = getRiskFactors(product)
  const currentProductId = product?.id ?? id
  const basicReport = useMemo(() => (product ? buildBasicProductReport(product) : ''), [product])
  const reportContent = aiReport || basicReport
  const reportSource = getReportSourceLabel(aiReport ? 'ai' : 'basic')

  return (
    <section className="page detail-page">
      <Link to="/products" className="detail-page__back-link">
        返回商品列表
      </Link>

      {loading ? <LoadingState>商品详情加载中...</LoadingState> : null}

      {!loading && error ? (
        <div className="detail-page__error">
          <ErrorState>{error}</ErrorState>
          <Link to="/products" className="detail-page__back-link">
            返回商品列表
          </Link>
        </div>
      ) : null}

      {!error && product ? (
        <>
          <div className="detail-page__hero">
            <div className="detail-page__image-panel">
              <img
                className="detail-page__image"
                src={productImage}
                alt={getProductName(product)}
                onError={() => setImageLoadError(true)}
              />
            </div>

            <div className="detail-page__summary">
              <p className="detail-page__category">{getProductCategory(product)}</p>
              <h3 className="detail-page__product-name">{getProductName(product)}</h3>
              <p className="detail-page__summary-text">
                商品编号 <strong>{currentProductId}</strong>。结合售价、成本、物流、竞争和风险标签，判断该款是否适合进入后续选品跟进。
              </p>

              <div className="detail-page__decision-grid">
                <DecisionMetric
                  label="推荐评分"
                  value={formatScore(product.recommendationScore)}
                  tone="score"
                />
                <DecisionMetric
                  label="利润率"
                  value={formatPercent(product.profitRatePercent)}
                  tone="profit"
                />
                <DecisionMetric
                  label="预估月销量"
                  value={formatNumber(product.estimatedMonthlySales)}
                  tone="market"
                />
                <DecisionMetric
                  label="竞争指数"
                  value={formatScore(product.competitionScore)}
                  tone="competition"
                />
                <DecisionMetric
                  label="风险等级"
                  value={getRiskLevelText(product.riskLevel, { short: true, emptyText: '暂无' })}
                  tone="risk"
                />
              </div>

              <div className="detail-page__decision-reason">
                <span className="detail-page__decision-reason-label">选品判断</span>
                <p className="detail-page__decision-reason-text">
                  {formatText(product.recommendationReason)}
                </p>
              </div>

              <div className="detail-page__favorite-area">
                <button
                  className="detail-page__favorite-button"
                  type="button"
                  disabled={favoriteLoading}
                  onClick={handleAddFavorite}
                >
                  {favoriteLoading ? '加入中...' : '加入候选池'}
                </button>

                {favoriteMessage ? (
                  <p
                    className={`detail-page__favorite-message detail-page__favorite-message--${favoriteMessageType}`}
                  >
                    {favoriteMessage}
                  </p>
                ) : null}
              </div>

              <div className="detail-page__tag-list">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <span key={tag} className="detail-page__tag">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="detail-page__tag detail-page__tag--empty">暂无</span>
                )}
              </div>
            </div>
          </div>

          <div className="detail-page__sections">
            <section className="detail-page__section">
              <h3 className="detail-page__section-title">基础信息</h3>
              <dl className="detail-page__grid">
                <DetailItem label="商品名称" value={getProductName(product)} />
                <DetailItem label="商品类型" value={getProductCategory(product)} />
                <DetailItem label="材质" value={formatText(product.material)} />
                <DetailItem label="供应商" value={formatText(product.supplier)} />
                <DetailItem
                  label="标签"
                  value={tags.length > 0 ? tags.join(' / ') : '暂无'}
                />
              </dl>
            </section>

            <section className="detail-page__section">
              <h3 className="detail-page__section-title">价格与利润测算</h3>
              <dl className="detail-page__grid">
                <DetailItem label="Amazon 售价" value={formatMoney(product.amazonPrice, '$')} />
                <DetailItem label="1688 成本" value={formatMoney(product.cost1688, '¥')} />
                <DetailItem label="物流成本" value={formatMoney(product.shippingCost, '¥')} />
                <DetailItem label="平台手续费" value={formatMoney(product.platformFee, '¥')} />
                <DetailItem label="总成本" value={formatMoney(product.totalCost, '¥')} />
                <DetailItem label="利润" value={formatMoney(product.profit, '¥')} tone="profit" />
                <DetailItem
                  label="利润率"
                  value={formatPercent(product.profitRatePercent)}
                  tone="profit"
                />
              </dl>
            </section>

            <section className="detail-page__section">
              <h3 className="detail-page__section-title">市场表现</h3>
              <dl className="detail-page__grid">
                <DetailItem
                  label="预估月销量"
                  value={formatNumber(product.estimatedMonthlySales)}
                />
                <DetailItem label="评分" value={formatRating(product.rating)} />
                <DetailItem label="评论数" value={formatNumber(product.reviewCount)} />
                <DetailItem label="竞争指数" value={formatScore(product.competitionScore)} tone="competition" />
                <DetailItem
                  label="竞争等级"
                  value={getRiskLevelText(product.competitionLevel, { short: true, emptyText: '暂无' })}
                />
                <DetailItem label="推荐评分" value={formatScore(product.recommendationScore)} />
              </dl>
            </section>

            <section className="detail-page__section">
              <h3 className="detail-page__section-title">风险分析</h3>
              <dl className="detail-page__grid">
                <DetailItem
                  label="风险等级"
                  value={getRiskLevelText(product.riskLevel, { short: true, emptyText: '暂无' })}
                  tone="risk"
                />
              </dl>
              <div className="detail-page__list-block">
                <h4 className="detail-page__list-title">风险因素</h4>
                {riskFactors.length > 0 ? (
                  <div className="detail-page__risk-tag-list">
                    {riskFactors.map((riskFactor) => (
                      <span key={riskFactor} className="detail-page__risk-tag">
                        {riskFactor}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="detail-page__empty-text">暂无明显风险</p>
                )}
              </div>
            </section>

            <section className="detail-page__section">
              <h3 className="detail-page__section-title">推荐说明</h3>
              <p className="detail-page__recommendation">
                {formatText(product.recommendationReason)}
              </p>
            </section>

            <section className="detail-page__section product-report">
              <div className="product-report__header">
                <div>
                  <p className="product-report__eyebrow">Product Report</p>
                  <h3 className="detail-page__section-title product-report__title">
                    AI 选品分析报告
                  </h3>
                </div>
                <span className="product-report__source">{reportSource}</span>
              </div>

              <div className="product-report__actions">
                <button
                  className="detail-page__favorite-button"
                  type="button"
                  disabled={reportLoading}
                  onClick={handleGenerateAiReport}
                >
                  {reportLoading ? 'AI 正在分析当前商品...' : '生成 AI 深度报告'}
                </button>
                {reportError ? <p className="product-report__error">{reportError}</p> : null}
              </div>

              <MarkdownContent className="product-report__content">
                {reportContent}
              </MarkdownContent>
            </section>
          </div>
        </>
      ) : null}
    </section>
  )
}

export default ProductDetailPage
