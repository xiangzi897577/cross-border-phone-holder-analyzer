import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import { getProducts } from '../services/api'
import { formatPercent, formatScore } from '../utils/format'
import { safeNumber } from '../utils/number'
import {
  getProductCategory,
  getProductName,
  getRiskFactors,
  getRiskLevelText,
} from '../utils/product'

function getRecommendationText(recommendationReason) {
  if (Array.isArray(recommendationReason)) {
    return recommendationReason.filter(Boolean).join('；') || '暂无推荐理由。'
  }

  if (typeof recommendationReason === 'string' && recommendationReason.trim()) {
    return recommendationReason
  }

  return '暂无推荐理由。'
}

function sortByRecommendation(products) {
  return [...products].sort((firstProduct, secondProduct) => {
    const firstScore = safeNumber(firstProduct.recommendationScore, 0)
    const secondScore = safeNumber(secondProduct.recommendationScore, 0)

    if (secondScore !== firstScore) {
      return secondScore - firstScore
    }

    return (
      safeNumber(secondProduct.profitRatePercent, 0) -
      safeNumber(firstProduct.profitRatePercent, 0)
    )
  })
}

function AnalysisProductCard({ product, cardType }) {
  const recommendationText = getRecommendationText(product?.recommendationReason)
  const riskFactors = getRiskFactors(product)

  return (
    <article className={`analysis-card analysis-card--${cardType}`}>
      <div className="analysis-card__header">
        <p className="analysis-card__category">{getProductCategory(product, '暂无类目')}</p>
        <h4 className="analysis-card__title">{getProductName(product, '暂无商品名称')}</h4>
      </div>

      <div className="analysis-card__metrics">
        <div className="analysis-card__metric analysis-card__metric--profit">
          <span className="analysis-card__metric-label">利润率</span>
          <strong className="analysis-card__metric-value">
            {formatPercent(product.profitRatePercent)}
          </strong>
        </div>

        <div className="analysis-card__metric analysis-card__metric--competition">
          <span className="analysis-card__metric-label">竞争指数</span>
          <strong className="analysis-card__metric-value">
            {formatScore(product.competitionScore)}
          </strong>
        </div>

        <div className="analysis-card__metric analysis-card__metric--risk">
          <span className="analysis-card__metric-label">风险等级</span>
          <strong className="analysis-card__metric-value">
            {getRiskLevelText(product.riskLevel, { emptyText: '未知', unknownText: '未知' })}
          </strong>
        </div>

        <div className="analysis-card__metric analysis-card__metric--score">
          <span className="analysis-card__metric-label">推荐评分</span>
          <strong className="analysis-card__metric-value">
            {formatScore(product.recommendationScore)}
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
        const profitRatePercent = safeNumber(product.profitRatePercent, 0)
        const competitionScore = safeNumber(product.competitionScore, 100)
        const recommendationScore = safeNumber(product.recommendationScore, 0)

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
        const firstCompetitionScore = safeNumber(firstProduct.competitionScore, 0)
        const secondCompetitionScore = safeNumber(secondProduct.competitionScore, 0)

        if (secondRiskCount !== firstRiskCount) {
          return secondRiskCount - firstRiskCount
        }

        return secondCompetitionScore - firstCompetitionScore
      })
      .slice(0, 6)

    const lowCompetitionHighProfitProducts = sortByRecommendation(
      products.filter((product) => {
        const profitRatePercent = safeNumber(product.profitRatePercent, 0)
        const competitionScore = safeNumber(product.competitionScore, 100)

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
      {loading ? <LoadingState>选品分析数据加载中...</LoadingState> : null}

      {!loading && error ? <ErrorState>{error}</ErrorState> : null}

      {!loading && !error && !hasProducts ? (
        <EmptyState>暂无商品数据，暂时无法生成选品分析。</EmptyState>
      ) : null}

      {!loading && !error && hasProducts ? (
        <>
          <div className="analysis-page__summary">
            <div className="analysis-page__summary-item analysis-page__summary-item--primary">
              <span className="analysis-page__summary-label">商品池数量</span>
              <strong className="analysis-page__summary-value">{products.length}</strong>
            </div>

            <div className="analysis-page__summary-item analysis-page__summary-item--potential">
              <span className="analysis-page__summary-label">高潜力商品</span>
              <strong className="analysis-page__summary-value">
                {analysisGroups.highPotentialProducts.length}
              </strong>
            </div>

            <div className="analysis-page__summary-item analysis-page__summary-item--risk">
              <span className="analysis-page__summary-label">高风险商品</span>
              <strong className="analysis-page__summary-value">
                {analysisGroups.highRiskProducts.length}
              </strong>
            </div>

            <div className="analysis-page__summary-item analysis-page__summary-item--opportunity">
              <span className="analysis-page__summary-label">低竞争高利润</span>
              <strong className="analysis-page__summary-value">
                {analysisGroups.lowCompetitionHighProfitProducts.length}
              </strong>
            </div>
          </div>

          <p className="page-note page-note--info">
            当前分析维度覆盖推荐评分、利润率、竞争指数和风险因素数量，适合用于初筛后进一步核价、看评价和确认供应稳定性。
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
