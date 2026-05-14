function Header() {
  return (
    <header className="top-header">
      <div className="top-header__intro">
        <p className="top-header__eyebrow">当前项目</p>
        <h2 className="top-header__title">跨境电商手机支架选品分析平台</h2>
        <p className="top-header__description">
          现在先把后台系统风格的页面结构搭起来，后续再逐步补商品数据和业务模块。
        </p>
      </div>

      <div className="top-header__status">
        <p className="top-header__stage">当前阶段：Day 9 Layout</p>
        <p className="top-header__note">后台系统布局搭建中</p>
      </div>
    </header>
  )
}

export default Header
