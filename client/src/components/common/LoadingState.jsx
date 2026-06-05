function LoadingState({ children = '数据加载中...' }) {
  return <p className="page-note page-note--loading">{children}</p>
}

export default LoadingState
