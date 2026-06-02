import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const chartData = [
  { name: '桌面支架', value: 12 },
  { name: '车载支架', value: 8 },
  { name: '折叠支架', value: 6 },
  { name: '磁吸支架', value: 10 },
]

const pieColors = ['#14b8a6', '#2563eb', '#f59e0b', '#ef4444']

function BasicChart() {
  return (
    <section className="basic-chart">
      <div className="basic-chart__card">
        <div className="basic-chart__header">
          <h3 className="basic-chart__title">手机支架类型测试柱状图</h3>
          <p className="basic-chart__description">使用固定测试数据，先验证 Recharts 基础渲染。</p>
        </div>

        <div className="basic-chart__chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" name="测试数量" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="basic-chart__card">
        <div className="basic-chart__header">
          <h3 className="basic-chart__title">手机支架类型测试饼图</h3>
          <p className="basic-chart__description">同一组数据换成 PieChart，观察图表组件写法差异。</p>
        </div>

        <div className="basic-chart__chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={46}
                outerRadius={86}
                paddingAngle={3}
              >
                {chartData.map((item, index) => (
                  <Cell key={item.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

export default BasicChart
