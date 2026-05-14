import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: '数据看板', path: '/' },
  { label: '商品列表', path: '/products' },
  { label: '选品分析', path: '/analysis' },
  { label: '候选池', path: '/favorites' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <p className="sidebar__eyebrow">Cross-border Commerce</p>
        <h1 className="sidebar__title">手机支架选品分析</h1>
        <p className="sidebar__description">Day 9 先完成后台系统整体布局骨架。</p>
      </div>

      <nav className="sidebar__nav" aria-label="侧边导航">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
