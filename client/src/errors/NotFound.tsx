import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import styled from '@emotion/styled'

const Page = styled.main`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 5rem;
`

const NotFound = () => {
  const { t: translations } = useTranslation()

  return (
    <Page>
      <Typography variant="h1">
        {translations('page.error.not-found.headline')}
      </Typography>
      <Typography variant="h2">
        {translations('page.error.not-found.subtitle')}
      </Typography>
    </Page>
  )
}

export default NotFound
