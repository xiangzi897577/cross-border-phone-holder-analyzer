import { useEffect, useState } from 'react'
import CategoryPieChart from '../components/CategoryPieChart.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import ProfitRankingChart from '../components/ProfitRankingChart.jsx'
import StatCard from '../components/StatCard.jsx'
import { getDashboard } from '../services/api'
import { formatNumber, formatPercent } from '../utils/format'

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchDashboard() {
      setLoading(true)
      setError('')
      setDashboard(null)

      try {
        const dashboardData = await getDashboard({ signal: abortController.signal })
        setDashboard(dashboardData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || '获取 Dashboard 数据失败')
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
  }, [])

  const averageProfitRatePercent =
    typeof dashboard?.averageProfitRatePercent === 'number'
      ? dashboard.averageProfitRatePercent
      : typeof dashboard?.averageProfitRate === 'number'
        ? dashboard.averageProfitRate * 100
        : undefined

  return (
    <section className="page dashboard-page">
      {loading ? <LoadingState>Dashboard 数据加载中...</LoadingState> : null}

      {!loading && error ? <ErrorState>{error}</ErrorState> : null}

      {!loading && !error && !dashboard ? (
        <EmptyState>暂无 Dashboard 数据。</EmptyState>
      ) : null}

      {!loading && !error && dashboard ? (
        <>
          <div className="dashboard-page__stats">
            <StatCard
              title="总商品数"
              value={formatNumber(dashboard.totalProducts)}
              description="当前商品池中的候选商品数量"
              tone="primary"
            />
            <StatCard
              title="平均利润率"
              value={formatPercent(averageProfitRatePercent)}
              description="按售价、成本、物流和平台费用综合计算"
              tone="profit"
            />
            <StatCard
              title="高潜力商品数"
              value={formatNumber(dashboard.highPotentialCount)}
              description="利润和竞争表现较好的候选商品"
              tone="success"
            />
            <StatCard
              title="风险商品数"
              value={formatNumber(dashboard.riskProductCount)}
              description="风险等级较高或需要谨慎评估的商品"
              tone="risk"
            />
          </div>

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
