import { useLocation } from 'react-router-dom'

const headerConfig = {
  '/': {
    eyebrow: 'Dashboard',
    title: '数据看板',
    description: '检查 Dashboard 指标展示和后端统计接口联调是否稳定。',
  },
  '/products': {
    eyebrow: 'Products',
    title: '商品列表',
    description: '检查商品列表请求、搜索筛选入口和基础卡片展示是否稳定。',
  },
  '/analysis': {
    eyebrow: 'Analysis',
    title: '选品分析',
    description: '检查选品分析页的业务分区、推荐理由和详情跳转是否稳定。',
  },
  '/favorites': {
    eyebrow: 'Favorites',
    title: '候选池',
    description: '检查候选池页面的收藏商品展示和基础状态反馈是否稳定。',
  },
}

function getHeaderConfig(pathname) {
  if (pathname.startsWith('/products/')) {
    return {
      eyebrow: 'Product Detail',
      title: '商品详情',
      description: '检查商品详情页路由参数、详情接口请求和核心字段展示是否稳定。',
    }
  }

  return (
    headerConfig[pathname] || {
      eyebrow: '当前项目',
      title: '跨境电商手机支架选品分析平台',
      description: '围绕利润、竞争、风险和推荐评分，辅助筛选更值得跟进的手机支架候选商品。',
    }
  )
}

function Header() {
  const location = useLocation()
  const currentHeader = getHeaderConfig(location.pathname)

  return (
    <header className="top-header">
      <div className="top-header__intro">
        <p className="top-header__eyebrow">{currentHeader.eyebrow}</p>
        <h2 className="top-header__title">{currentHeader.title}</h2>
        <p className="top-header__description">{currentHeader.description}</p>
      </div>
    </header>
  )
}

export default Header
