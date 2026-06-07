import { useEffect, useMemo, useState } from 'react'
import CategoryPieChart from '../components/CategoryPieChart.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import ProfitRankingChart from '../components/ProfitRankingChart.jsx'
import RecommendationCompetitionChart from '../components/RecommendationCompetitionChart.jsx'
import StatCard from '../components/StatCard.jsx'
import { getCachedDashboard, getCachedProducts, getDashboard, getProducts } from '../services/api'
import { formatNumber, formatPercent } from '../utils/format'

function buildDashboardConclusions(dashboard) {
  if (!dashboard) {
    return []
  }

  const conclusions = []
  const highPotentialCount = Number(dashboard.highPotentialCount) || 0
  const riskProductCount = Number(dashboard.riskProductCount) || 0
  const lowCompetitionHighProfitCount = Number(dashboard.lowCompetitionHighProfitCount) || 0
  const averageCompetitionScore = Number(dashboard.averageCompetitionScore) || 0

  if (lowCompetitionHighProfitCount > 0) {
    conclusions.push({
      label: '优先跟进',
      text: `当前有 ${lowCompetitionHighProfitCount} 个低竞争高利润机会款，适合进入候选池做供应商和评价结构复核。`,
      tone: 'opportunity',
    })
  } else {
    conclusions.push({
      label: '机会判断',
      text: '当前商品池暂未出现明显低竞争高利润组合，建议优先优化筛选条件或补充更多候选商品。',
      tone: 'market',
    })
  }

  conclusions.push({
    label: '竞争压力',
    text:
      averageCompetitionScore >= 65
        ? `平均竞争指数 ${formatNumber(averageCompetitionScore)}，整体竞争偏高，建议优先选择差异化卖点明确的商品。`
        : `平均竞争指数 ${formatNumber(averageCompetitionScore)}，商品池竞争压力相对可控，适合做轻量测款。`,
    tone: averageCompetitionScore >= 65 ? 'risk' : 'market',
  })

  conclusions.push({
    label: '风险排查',
    text:
      riskProductCount > 0
        ? `当前有 ${riskProductCount} 个风险商品，需要先确认物流、评分、评论数和竞争风险，再决定是否上架。`
        : `当前高风险商品较少，高潜力商品 ${highPotentialCount} 个，可优先进行成本和供货稳定性复核。`,
    tone: riskProductCount > 0 ? 'risk' : 'opportunity',
  })

  return conclusions
}

function DashboardPage() {
  const cachedDashboard = useMemo(() => getCachedDashboard(), [])
  const cachedProducts = useMemo(() => getCachedProducts(), [])
  const [dashboard, setDashboard] = useState(cachedDashboard)
  const [products, setProducts] = useState(cachedProducts)
  const [loading, setLoading] = useState(!cachedDashboard)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchDashboard() {
      const hasExistingDashboard = Boolean(cachedDashboard)

      setLoading(true)
      setError('')

      try {
        const [dashboardData, productsData] = await Promise.all([
          getDashboard({ signal: abortController.signal }),
          getProducts({}, { signal: abortController.signal }),
        ])
        setDashboard(dashboardData)
        setProducts(productsData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          if (!hasExistingDashboard) {
            setError(requestError.message || '获取 Dashboard 数据失败')
          }
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      abortController.abort()
    }
  }, [cachedDashboard])

  const averageProfitRatePercent =
    typeof dashboard?.averageProfitRatePercent === 'number'
      ? dashboard.averageProfitRatePercent
      : typeof dashboard?.averageProfitRate === 'number'
        ? dashboard.averageProfitRate * 100
        : undefined
  const dashboardConclusions = buildDashboardConclusions(dashboard)
  const hasDashboard = Boolean(dashboard)

  return (
    <section className="page dashboard-page">
      {loading && !hasDashboard ? <LoadingState>Dashboard 数据加载中...</LoadingState> : null}

      {loading && hasDashboard ? (
        <p className="page-note page-note--info">正在同步最新看板数据，当前结果可继续查看。</p>
      ) : null}

      {!loading && error ? <ErrorState>{error}</ErrorState> : null}

      {!loading && !error && !dashboard ? (
        <EmptyState>暂无 Dashboard 数据。</EmptyState>
      ) : null}

      {!error && dashboard ? (
        <>
          <section className="dashboard-page__hero">
            <div>
              <p className="dashboard-page__eyebrow">AI Selection Dashboard</p>
              <h2 className="dashboard-page__hero-title">
                跨境电商手机支架选品决策看板
              </h2>
              <p className="dashboard-page__hero-description">
                基于利润、竞争、风险和 AI 报告能力，帮助快速识别值得跟进的候选商品。
              </p>
            </div>
            <div className="dashboard-page__hero-meta">
              <span>商品池：{formatNumber(dashboard.totalProducts)} 件</span>
              <span>高潜力：{formatNumber(dashboard.highPotentialCount)} 件</span>
            </div>
          </section>

          <div className="dashboard-page__stats">
            <StatCard
              title="商品池规模"
              value={formatNumber(dashboard.totalProducts)}
              description="当前可用于策略筛选、候选对比和 AI 报告分析的商品总量"
              tone="primary"
            />
            <StatCard
              title="平均利润率"
              value={formatPercent(averageProfitRatePercent)}
              description="衡量当前商品池整体利润空间，辅助判断测款预算余量"
              tone="profit"
            />
            <StatCard
              title="高潜力商品"
              value={formatNumber(dashboard.highPotentialCount)}
              description="利润、评分和竞争表现相对均衡，适合优先进入候选池"
              tone="success"
            />
            <StatCard
              title="风险商品"
              value={formatNumber(dashboard.riskProductCount)}
              description="需要重点复核物流、评分、评论数或竞争压力的商品"
              tone="risk"
            />
          </div>

          <section className="dashboard-page__decision-panel">
            <div className="dashboard-page__decision-header">
              <p className="dashboard-page__eyebrow">Decision Brief</p>
              <h3 className="dashboard-page__decision-title">当前商品池判断</h3>
            </div>
            <div className="dashboard-page__decision-list">
              {dashboardConclusions.map((conclusion) => (
                <article
                  className={`dashboard-page__decision dashboard-page__decision--${conclusion.tone}`}
                  key={conclusion.label}
                >
                  <strong>{conclusion.label}</strong>
                  <p>{conclusion.text}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="dashboard-page__insights">
            <div className="dashboard-page__insight dashboard-page__insight--opportunity">
              <span className="dashboard-page__insight-label">低竞争高利润机会</span>
              <strong className="dashboard-page__insight-value">
                {formatNumber(dashboard.lowCompetitionHighProfitCount)}
              </strong>
              <p className="dashboard-page__insight-text">
                可优先进入候选池，后续重点核对供应稳定性和评价结构。
              </p>
            </div>

            <div className="dashboard-page__insight dashboard-page__insight--market">
              <span className="dashboard-page__insight-label">平均竞争指数</span>
              <strong className="dashboard-page__insight-value">
                {formatNumber(dashboard.averageCompetitionScore)}
              </strong>
              <p className="dashboard-page__insight-text">
                用于判断当前商品池整体竞争压力，数值越低越适合轻量试单。
              </p>
            </div>
          </div>

          <RecommendationCompetitionChart products={products} />

          <div className="dashboard-page__charts">
            <ProfitRankingChart topProfitProducts={dashboard.topProfitProducts} />
            <CategoryPieChart categoryDistribution={dashboard.categoryDistribution} />
          </div>
        </>
      ) : null}
    </section>
  )
}

export default DashboardPage
