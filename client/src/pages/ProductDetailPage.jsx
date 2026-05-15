import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '../services/api'

const levelTextMap = {
  low: '低',
  medium: '中',
  high: '高',
  unknown: '未知',
}

function formatMoney(value, symbol) {
  if (typeof value !== 'number') {
    return '-'
  }

  return `${symbol}${value.toFixed(2)}`
}

function formatPercent(value) {
  if (typeof value !== 'number') {
    return '0.0%'
  }

  return `${value.toFixed(1)}%`
}

function formatNumber(value, digits = 0) {
  if (typeof value !== 'number') {
    return digits === 0 ? '0' : (0).toFixed(digits)
  }

  return value.toFixed(digits)
}

function formatText(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return '暂无'
  }

  return value
}

function formatLevel(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return '暂无'
  }

  return levelTextMap[value] || value
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-page__item">
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

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchProductDetail() {
      setLoading(true)
      setError('')
      setProduct(null)
      setImageLoadError(false)

      try {
        const productData = await getProductById(id, { signal: abortController.signal })
        setProduct(productData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || '获取商品详情失败')
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
    }
  }, [id])

  const hasImage =
    typeof product?.image === 'string' && product.image.trim() !== '' && !imageLoadError
  const tags = Array.isArray(product?.tags) ? product.tags : []
  const riskFactors = Array.isArray(product?.riskFactors) ? product.riskFactors : []
  const currentProductId = product?.id ?? id

  return (
    <section className="page detail-page">
      <Link to="/products" className="detail-page__back-link">
        返回商品列表
      </Link>

      <h2 className="page-title">商品详情</h2>
      <p className="page-description">
        当前页面会根据 URL 中的商品 id 请求 Node 后端的 <code>/api/products/:id</code>{' '}
        接口，页面里的商品信息都来自后端返回的详情数据。
      </p>

      {loading ? <p className="page-note page-note--loading">商品详情加载中...</p> : null}

      {!loading && error ? (
        <div className="detail-page__error">
          <p className="page-note page-note--error">请求失败：{error}</p>
          <Link to="/products" className="detail-page__back-link">
            返回商品列表
          </Link>
        </div>
      ) : null}

      {!loading && !error && product ? (
        <>
          <div className="detail-page__hero">
            <div className="detail-page__image-panel">
              {hasImage ? (
                <img
                  className="detail-page__image"
                  src={product.image}
                  alt={formatText(product.productName)}
                  onError={() => setImageLoadError(true)}
                />
              ) : (
                <div className="detail-page__image-placeholder">暂无图片</div>
              )}
            </div>

            <div className="detail-page__summary">
              <p className="detail-page__category">{formatText(product.category)}</p>
              <h3 className="detail-page__product-name">{formatText(product.productName)}</h3>
              <p className="detail-page__summary-text">
                当前商品 id：<strong>{currentProductId}</strong>。详情页先用{' '}
                <code>useParams()</code> 读取路由参数，再调用 <code>getProductById(id)</code>{' '}
                请求后端接口。
              </p>

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
                <DetailItem label="商品名称" value={formatText(product.productName)} />
                <DetailItem label="商品类型" value={formatText(product.category)} />
                <DetailItem label="材质" value={formatText(product.material)} />
                <DetailItem label="供应商" value={formatText(product.supplier)} />
                <DetailItem
                  label="标签"
                  value={tags.length > 0 ? tags.join(' / ') : '暂无'}
                />
              </dl>
            </section>

            <section className="detail-page__section">
              <h3 className="detail-page__section-title">价格与利润</h3>
              <dl className="detail-page__grid">
                <DetailItem label="Amazon 售价" value={formatMoney(product.amazonPrice, '$')} />
                <DetailItem label="1688 成本" value={formatMoney(product.cost1688, '¥')} />
                <DetailItem label="物流成本" value={formatMoney(product.shippingCost, '¥')} />
                <DetailItem label="平台手续费" value={formatMoney(product.platformFee, '¥')} />
                <DetailItem label="总成本" value={formatMoney(product.totalCost, '¥')} />
                <DetailItem label="利润" value={formatMoney(product.profit, '¥')} />
                <DetailItem
                  label="利润率"
                  value={formatPercent(product.profitRatePercent)}
                />
              </dl>
            </section>

            <section className="detail-page__section">
              <h3 className="detail-page__section-title">市场与风险</h3>
              <dl className="detail-page__grid">
                <DetailItem
                  label="预估月销量"
                  value={formatNumber(product.estimatedMonthlySales)}
                />
                <DetailItem label="评分" value={formatNumber(product.rating, 1)} />
                <DetailItem label="评论数" value={formatNumber(product.reviewCount)} />
                <DetailItem label="竞争指数" value={formatNumber(product.competitionScore)} />
                <DetailItem label="竞争等级" value={formatLevel(product.competitionLevel)} />
                <DetailItem label="风险等级" value={formatLevel(product.riskLevel)} />
              </dl>

              <div className="detail-page__list-block">
                <h4 className="detail-page__list-title">风险因素</h4>
                {riskFactors.length > 0 ? (
                  <ul className="detail-page__bullet-list">
                    {riskFactors.map((riskFactor) => (
                      <li key={riskFactor}>{riskFactor}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="detail-page__empty-text">暂无</p>
                )}
              </div>
            </section>

            <section className="detail-page__section">
              <h3 className="detail-page__section-title">推荐说明</h3>
              <p className="detail-page__recommendation">
                {formatText(product.recommendationReason)}
              </p>
            </section>
          </div>
        </>
      ) : null}
    </section>
  )
}

export default ProductDetailPage
