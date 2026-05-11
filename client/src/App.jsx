import './App.css'

const focusMetrics = [
  {
    value: 'Profit Margin',
    title: '利润率',
    description: '对比 Amazon 售价、1688 采购价、平台佣金和预估运费，快速判断是否值得继续分析。',
  },
  {
    value: 'Logistics Cost',
    title: '物流成本',
    description: '围绕轻小件属性估算重量、体积和跨境物流压力，突出手机支架品类的现实约束。',
  },
  {
    value: 'Competition',
    title: '竞争强度',
    description: '结合评论量、评分、卖家数量和类目情况，模拟选品时最常见的竞争判断方式。',
  },
  {
    value: 'Rating Risk',
    title: '评分风险',
    description: '识别低评分、差评集中点和质量风险，为推荐指数提供更真实的减分逻辑。',
  },
]

const buildStages = [
  {
    step: '01',
    title: 'Day 1: Project Setup',
    description: '完成 React + Node.js 前后端分离脚手架、文档体系和基础接口约定。',
  },
  {
    step: '02',
    title: 'Mock Data Design',
    description: '定义 Amazon 商品字段、1688 货源字段，以及利润率和推荐指数的基础计算口径。',
  },
  {
    step: '03',
    title: 'Dashboard UI',
    description: '落地候选商品列表、筛选栏、分析卡片和风险提示区，让页面更像真实业务工具。',
  },
  {
    step: '04',
    title: 'API Integration',
    description: '接通本地 JSON 数据和分析接口，形成可演示、可讲解、可投递的完整项目闭环。',
  },
]

const techStack = ['React', 'Vite', 'JavaScript', 'Node.js', 'Express', 'JSON']

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Summer Internship Project</p>
          <h1>跨境电商手机支架选品分析平台</h1>
          <p className="hero-text">
            一个聚焦跨境电商轻小件选品判断的前后端分离项目。它不会做“全站商城”，而是把重心放在
            利润率、物流成本、竞争强度和评分风险这些更接近真实选品工作的维度上。
          </p>

          <div className="tag-row" aria-label="Tech stack">
            {techStack.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="hero-board" aria-label="Project snapshot">
          <div className="board-header">
            <span className="board-dot board-dot-red"></span>
            <span className="board-dot board-dot-yellow"></span>
            <span className="board-dot board-dot-green"></span>
          </div>

          <div className="board-content">
            <div className="board-kpi">
              <p className="kpi-label">Current Stage</p>
              <p className="kpi-value">Day 1 Setup</p>
            </div>

            <div className="board-cards">
              <div className="mini-card">
                <span>Frontend</span>
                <strong>Vite + React</strong>
              </div>
              <div className="mini-card">
                <span>Backend</span>
                <strong>Express API</strong>
              </div>
              <div className="mini-card">
                <span>Data</span>
                <strong>Local JSON</strong>
              </div>
            </div>

            <div className="board-route">
              <span>Health Endpoint</span>
              <code>/api/health</code>
            </div>
          </div>
        </aside>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="section-kicker">Core Analysis Dimensions</p>
          <h2>这个项目以后真正要分析什么</h2>
        </div>

        <div className="metric-grid">
          {focusMetrics.map((metric) => (
            <article className="metric-card" key={metric.title}>
              <p className="metric-value">{metric.value}</p>
              <h3>{metric.title}</h3>
              <p>{metric.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="section-kicker">Build Roadmap</p>
          <h2>不是静态摆设，而是在按阶段推进</h2>
        </div>

        <div className="roadmap">
          {buildStages.map((stage) => (
            <article className="roadmap-card" key={stage.step}>
              <span className="roadmap-step">{stage.step}</span>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bottom-strip">
        <div>
          <p className="section-kicker">Today</p>
          <h2>当前版本仍然是 Day 1 占位页</h2>
        </div>
        <p className="bottom-copy">
          所以现在它看起来还不像真正的数据平台，这不是 React 没起作用，而是今天刻意没有接商品列表、
          没有接分析接口、也没有做筛选交互。下一步我们就把它从“项目首页”推进到“分析面板”。
        </p>
      </section>
    </main>
  )
}

export default App
