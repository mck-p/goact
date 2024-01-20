import React from 'react'
import { Typography } from '@mui/material'

import Paper from '@mui/material/Paper'
import quotes from '../raw/quotes.json'

import styled from '@emotion/styled'

const QuoteWidget = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  max-width: 30rem;

  @media (max-width: 1250px) {
    max-width: 100%;
    margin-top: 1rem;
  }
`

const InspirationalQuote = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <QuoteWidget elevation={2}>
      <Typography variant="subtitle2" gutterBottom>
        {quote.text}
      </Typography>
      <Typography variant="caption">{quote.author}</Typography>
    </QuoteWidget>
  )
}

export default InspirationalQuote
