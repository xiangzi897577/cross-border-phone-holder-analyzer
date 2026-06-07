import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { chatWithAi } from '../services/api'

const MAX_AI_REQUEST_MESSAGES = 6
const MAX_AI_REQUEST_ASSISTANT_CONTENT_LENGTH = 700
const AI_TEMPORARY_ERROR_MESSAGE = 'AI 服务暂时不可用，请稍后再试'

function getMessagesForAiRequest(messages) {
  return messages
    .filter((message) => !message.isError)
    .slice(-MAX_AI_REQUEST_MESSAGES)
    .map((message) => {
      const content =
        message.role === 'assistant' &&
        message.content.length > MAX_AI_REQUEST_ASSISTANT_CONTENT_LENGTH
          ? `${message.content.slice(0, MAX_AI_REQUEST_ASSISTANT_CONTENT_LENGTH)}...`
          : message.content

      return {
        role: message.role,
        content,
      }
    })
}

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

function AiMessageContent({ message }) {
  if (message.role !== 'assistant' || message.isError) {
    return (
      <p className="ai-chat-widget__message-content ai-chat-widget__message-content--plain">
        {message.content}
      </p>
    )
  }

  return (
    <div className="ai-chat-widget__message-content ai-chat-widget__message-content--markdown">
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {message.content}
      </ReactMarkdown>
    </div>
  )
}

function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesRef = useRef(null)
  const sendingRef = useRef(false)

  useEffect(() => {
    if (!isOpen || !messagesRef.current) {
      return
    }

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [isOpen, messages, sending])

  async function handleSubmit(event) {
    event.preventDefault()

    const nextMessage = inputValue.trim()

    if (!nextMessage || sendingRef.current) {
      return
    }

    sendingRef.current = true
    const messageId = Date.now()
    const userMessage = {
      id: `user-${messageId}`,
      role: 'user',
      content: nextMessage,
    }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInputValue('')
    setError('')
    setSending(true)

    try {
      const result = await chatWithAi(getMessagesForAiRequest(nextMessages))
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-${messageId}`,
          role: 'assistant',
          content: result.reply || '暂时没有生成明确回复，请换个问题再试。',
        },
      ])
    } catch (requestError) {
      const errorMessage = requestError.message || AI_TEMPORARY_ERROR_MESSAGE

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-error-${messageId}`,
          role: 'assistant',
          content: errorMessage,
          isError: true,
        },
      ])
      setError(errorMessage)
    } finally {
      sendingRef.current = false
      setSending(false)
    }
  }

  function handleInputKeyDown(event) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return
    }

    event.preventDefault()

    if (sending || sendingRef.current || !inputValue.trim()) {
      return
    }

    event.currentTarget.form?.requestSubmit()
  }

  return (
    <div className="ai-chat-widget" aria-live="polite">
      {isOpen ? (
        <section className="ai-chat-widget__panel" aria-label="AI 选品助手">
          <header className="ai-chat-widget__header">
            <div>
              <p className="ai-chat-widget__eyebrow">AI Assistant</p>
              <h3 className="ai-chat-widget__title">AI 选品助手</h3>
            </div>
            <button
              className="ai-chat-widget__close-button"
              type="button"
              aria-label="关闭 AI 选品助手"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="ai-chat-widget__messages" ref={messagesRef}>
            {messages.length === 0 ? (
              <div className="ai-chat-widget__empty">
                <strong>可以咨询选品判断、利润机会和风险排查。</strong>
                <span>例如：哪些手机支架更适合优先加入候选池？</span>
              </div>
            ) : null}

            {messages.map((message) => (
              <div
                className={`ai-chat-widget__message ai-chat-widget__message--${message.role}`}
                key={message.id}
              >
                <span className="ai-chat-widget__message-role">
                  {message.role === 'user' ? '你' : 'AI'}
                </span>
                <AiMessageContent message={message} />
              </div>
            ))}

            {sending ? (
              <div className="ai-chat-widget__message ai-chat-widget__message--assistant">
                <span className="ai-chat-widget__message-role">AI</span>
                <p className="ai-chat-widget__message-content ai-chat-widget__message-content--loading">
                  正在分析...
                </p>
              </div>
            ) : null}
          </div>

          {error ? <p className="ai-chat-widget__error">{error}</p> : null}

          <form className="ai-chat-widget__form" onSubmit={handleSubmit}>
            <textarea
              className="ai-chat-widget__input"
              value={inputValue}
              rows="2"
              placeholder="输入选品问题..."
              disabled={sending}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <button
              className="ai-chat-widget__send-button"
              type="submit"
              disabled={sending || !inputValue.trim()}
            >
              {sending ? '发送中' : '发送'}
            </button>
          </form>
        </section>
      ) : null}

      <button
        className="ai-chat-widget__trigger"
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? '收起 AI 选品助手' : '打开 AI 选品助手'}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        AI 选品助手
      </button>
    </div>
  )
}

export default AiChatWidget
