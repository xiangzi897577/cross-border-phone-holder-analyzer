function ErrorState({ children, prefix = '请求失败：' }) {
  return <p className="page-note page-note--error">{prefix}{children}</p>
}

export default ErrorState
