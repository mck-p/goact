import React from 'react'
import { Message as MessageWrap } from './styled'
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import remarkGfm from 'remark-gfm'
import { useGetUserByIdQuery } from '../../../state/domains/users'

import UserAvatar from './UserAvatar'

interface Props {
  message: string
  receivedAt: string
  authorId: string
}

const Message = ({ message, receivedAt, authorId }: Props) => {
  const { data, isLoading } = useGetUserByIdQuery(authorId)

  if (isLoading) {
    return null
  }

  return (
    <MessageWrap>
      {data && (
        <UserAvatar name={data.name} url={data.avatarUrl} date={receivedAt} />
      )}
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
        {message}
      </Markdown>
    </MessageWrap>
  )
}

export default Message
