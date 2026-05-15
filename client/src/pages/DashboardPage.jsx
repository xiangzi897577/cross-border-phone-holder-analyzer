import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard.jsx'
import { getDashboard } from '../services/api'

function formatNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : '0'
}

function formatPercent(value) {
  return typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(1)}%` : '0.0%'
}

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
      <div className="dashboard-page__header">
        <h2 className="page-title">Dashboard 数据看板</h2>
        <p className="page-description">
          当前页面会请求 Node 后端的 <code>/api/dashboard</code>{' '}
          接口，并展示第二周主流程需要的 4 个核心指标。
        </p>
      </div>

      {loading ? <p className="page-note page-note--loading">Dashboard 数据加载中...</p> : null}

      {!loading && error ? <p className="page-note page-note--error">请求失败：{error}</p> : null}

      {!loading && !error && !dashboard ? (
        <p className="page-note page-note--empty">暂无 Dashboard 数据。</p>
      ) : null}

      {!loading && !error && dashboard ? (
        <div className="dashboard-page__stats">
          <StatCard
            title="总商品数"
            value={formatNumber(dashboard.totalProducts)}
            description="当前商品池中的候选商品数量"
          />
          <StatCard
            title="平均利润率"
            value={formatPercent(averageProfitRatePercent)}
            description="基于后端利润模型计算的平均利润率"
          />
          <StatCard
            title="高潜力商品数"
            value={formatNumber(dashboard.highPotentialCount)}
            description="利润和竞争表现较好的候选商品"
          />
          <StatCard
            title="风险商品数"
            value={formatNumber(dashboard.riskProductCount)}
            description="风险等级较高或需要谨慎评估的商品"
          />
        </div>
      ) : null}
    </section>
  )
}

export default DashboardPage
