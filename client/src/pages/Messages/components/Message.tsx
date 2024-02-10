import React from 'react'
import { MessageTimestamp, Message as MessageWrap } from './styled'
import { formatDistanceToNow } from 'date-fns'
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import remarkGfm from 'remark-gfm'

interface Props {
  payload: {
    message: string
  }
  metadata: {
    receivedAt: string
  }
}

const Message = ({ payload, metadata }: Props) => {
  return (
    <MessageWrap>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={a11yDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="md-post-code" {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {payload.message}
      </Markdown>
      <MessageTimestamp dateTime={metadata.receivedAt}>
        {formatDistanceToNow(new Date(metadata.receivedAt), {
          addSuffix: true,
        })}
      </MessageTimestamp>
    </MessageWrap>
  )
}

export default Message
