import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/api'

const RISK_LEVEL_LABELS = {
  high: '高风险',
  medium: '中风险',
  low: '低风险',
  unknown: '未知',
}

function formatPercent(value) {
  return typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(1)}%` : '0.0%'
}

function formatNumber(value, digits = 0) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(digits)
    : digits === 0
      ? '0'
      : (0).toFixed(digits)
}

function getRiskLevelLabel(riskLevel) {
  return RISK_LEVEL_LABELS[riskLevel] || '未知'
}

function getRecommendationText(recommendationReason) {
  if (Array.isArray(recommendationReason)) {
    return recommendationReason.filter(Boolean).join('；') || '暂无推荐理由。'
  }

  if (typeof recommendationReason === 'string' && recommendationReason.trim()) {
    return recommendationReason
  }

  return '暂无推荐理由。'
}

function getRiskFactors(product) {
  return Array.isArray(product?.riskFactors) ? product.riskFactors.filter(Boolean) : []
}

function sortByRecommendation(products) {
  return [...products].sort((firstProduct, secondProduct) => {
    const firstScore = firstProduct.recommendationScore ?? 0
    const secondScore = secondProduct.recommendationScore ?? 0

    if (secondScore !== firstScore) {
      return secondScore - firstScore
    }

    return (secondProduct.profitRatePercent ?? 0) - (firstProduct.profitRatePercent ?? 0)
  })
}

function AnalysisProductCard({ product, cardType }) {
  const recommendationText = getRecommendationText(product?.recommendationReason)
  const riskFactors = getRiskFactors(product)

  return (
    <article className={`analysis-card analysis-card--${cardType}`}>
      <div className="analysis-card__header">
        <p className="analysis-card__category">{product.category || '暂无类目'}</p>
        <h4 className="analysis-card__title">{product.productName || '暂无商品名称'}</h4>
      </div>

      <div className="analysis-card__metrics">
        <div className="analysis-card__metric">
          <span className="analysis-card__metric-label">利润率</span>
          <strong className="analysis-card__metric-value">
            {formatPercent(product.profitRatePercent)}
          </strong>
        </div>

        <div className="analysis-card__metric">
          <span className="analysis-card__metric-label">竞争指数</span>
          <strong className="analysis-card__metric-value">
            {formatNumber(product.competitionScore)}
          </strong>
        </div>

        <div className="analysis-card__metric">
          <span className="analysis-card__metric-label">风险等级</span>
          <strong className="analysis-card__metric-value">
            {getRiskLevelLabel(product.riskLevel)}
          </strong>
        </div>

        <div className="analysis-card__metric">
          <span className="analysis-card__metric-label">推荐评分</span>
          <strong className="analysis-card__metric-value">
            {formatNumber(product.recommendationScore)}
          </strong>
        </div>
      </div>

      {cardType === 'risk' ? (
        <div className="analysis-card__risk-factors">
          <span className="analysis-card__reason-label">风险原因</span>
          {riskFactors.length > 0 ? (
            <div className="analysis-card__risk-tag-list">
              {riskFactors.map((riskFactor) => (
                <span key={riskFactor} className="analysis-card__risk-tag">
                  {riskFactor}
                </span>
              ))}
            </div>
          ) : (
            <p className="analysis-card__risk-empty">暂无明显风险</p>
          )}
        </div>
      ) : null}

      <div className="analysis-card__reason">
        <span className="analysis-card__reason-label">推荐理由</span>
        <p className="analysis-card__reason-text">{recommendationText}</p>
      </div>

      <Link className="analysis-card__detail-link" to={`/products/${product.id}`}>
        查看商品详情
      </Link>
    </article>
  )
}

function AnalysisSection({ title, description, products, cardType, emptyText }) {
  return (
    <section className={`analysis-section analysis-section--${cardType}`}>
      <div className="analysis-section__header">
        <h3 className="analysis-section__title">{title}</h3>
        <p className="analysis-section__description">{description}</p>
      </div>

      {products.length > 0 ? (
        <div className="analysis-section__grid">
          {products.map((product) => (
            <AnalysisProductCard key={product.id} product={product} cardType={cardType} />
          ))}
        </div>
      ) : (
        <p className="analysis-section__empty">{emptyText}</p>
      )}
    </section>
  )
}

function AnalysisPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchProducts() {
      setLoading(true)
      setError('')
      setProducts([])

      try {
        const productsData = await getProducts({}, { signal: abortController.signal })
        setProducts(productsData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || '获取选品分析数据失败')
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      abortController.abort()
    }
  }, [])

  const analysisGroups = useMemo(() => {
    const highPotentialProducts = sortByRecommendation(
      products.filter((product) => {
        const profitRatePercent = product.profitRatePercent ?? 0
        const competitionScore = product.competitionScore ?? 100
        const recommendationScore = product.recommendationScore ?? 0

        return (
          product.riskLevel !== 'high' &&
          (recommendationScore >= 78 ||
            (profitRatePercent >= 220 && competitionScore <= 60))
        )
      }),
    ).slice(0, 6)

    const highRiskProducts = [...products]
      .filter((product) => {
        const riskFactorCount = getRiskFactors(product).length

        return product.riskLevel === 'high' || riskFactorCount >= 3
      })
      .sort((firstProduct, secondProduct) => {
        const firstRiskCount = getRiskFactors(firstProduct).length
        const secondRiskCount = getRiskFactors(secondProduct).length
        const firstCompetitionScore = firstProduct.competitionScore ?? 0
        const secondCompetitionScore = secondProduct.competitionScore ?? 0

        if (secondRiskCount !== firstRiskCount) {
          return secondRiskCount - firstRiskCount
        }

        return secondCompetitionScore - firstCompetitionScore
      })
      .slice(0, 6)

    const lowCompetitionHighProfitProducts = sortByRecommendation(
      products.filter((product) => {
        const profitRatePercent = product.profitRatePercent ?? 0
        const competitionScore = product.competitionScore ?? 100

        return competitionScore <= 55 && profitRatePercent >= 220
      }),
    ).slice(0, 6)

    return {
      highPotentialProducts,
      highRiskProducts,
      lowCompetitionHighProfitProducts,
    }
  }, [products])

  const hasProducts = products.length > 0

  return (
    <section className="page analysis-page">
      <h2 className="page-title">选品分析</h2>
      <p className="page-description">
        基于利润率、竞争指数、风险等级和推荐理由进行候选商品分析，帮助快速识别更值得跟进的手机支架商品。
      </p>

      {loading ? <p className="page-note page-note--loading">选品分析数据加载中...</p> : null}

      {!loading && error ? <p className="page-note page-note--error">请求失败：{error}</p> : null}

      {!loading && !error && !hasProducts ? (
        <p className="page-note page-note--empty">暂无商品数据，暂时无法生成选品分析。</p>
      ) : null}

      {!loading && !error && hasProducts ? (
        <>
          <div className="analysis-page__summary">
            <div className="analysis-page__summary-item">
              <span className="analysis-page__summary-label">商品池数量</span>
              <strong className="analysis-page__summary-value">{products.length}</strong>
            </div>

            <div className="analysis-page__summary-item">
              <span className="analysis-page__summary-label">高潜力商品</span>
              <strong className="analysis-page__summary-value">
                {analysisGroups.highPotentialProducts.length}
              </strong>
            </div>

            <div className="analysis-page__summary-item">
              <span className="analysis-page__summary-label">高风险商品</span>
              <strong className="analysis-page__summary-value">
                {analysisGroups.highRiskProducts.length}
              </strong>
            </div>

            <div className="analysis-page__summary-item">
              <span className="analysis-page__summary-label">低竞争高利润</span>
              <strong className="analysis-page__summary-value">
                {analysisGroups.lowCompetitionHighProfitProducts.length}
              </strong>
            </div>
          </div>

          <p className="page-note page-note--info">
            当前规则：高潜力商品优先按推荐评分从高到低展示，推荐评分综合利润率、月销量、评分、竞争指数、物流成本和重量体积；高风险看风险等级和风险因素数量；低竞争高利润看竞争指数不高于
            55 且利润率不低于 220%。
          </p>

          <AnalysisSection
            title="高潜力商品"
            description="利润空间、竞争压力和推荐评分综合表现较好的候选商品。"
            products={analysisGroups.highPotentialProducts}
            cardType="potential"
            emptyText="暂无符合高潜力规则的商品。"
          />

          <AnalysisSection
            title="高风险商品"
            description="风险等级较高，或风险因素较多，需要优先确认售后、包装和竞争压力。"
            products={analysisGroups.highRiskProducts}
            cardType="risk"
            emptyText="暂无符合高风险规则的商品。"
          />

          <AnalysisSection
            title="低竞争高利润商品"
            description="竞争指数相对可控，同时利润率表现较好的重点观察对象。"
            products={analysisGroups.lowCompetitionHighProfitProducts}
            cardType="opportunity"
            emptyText="暂无符合低竞争高利润规则的商品。"
          />
        </>
      ) : null}
    </section>
  )
}

export default AnalysisPage
