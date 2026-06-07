import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const markdownComponents = {
  table(props) {
    const tableProps = { ...props }
    delete tableProps.node

    return (
      <div className="ai-chat-widget__markdown-table-wrapper">
        <table {...tableProps} />
      </div>
    )
  },
}

function MarkdownContent({ children, className = '' }) {
  const content = typeof children === 'string' ? children : ''
  const contentClassName = className
    ? `ai-chat-widget__message-content--markdown ${className}`
    : 'ai-chat-widget__message-content--markdown'

  return (
    <div className={contentClassName}>
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownContent
