import { Paper } from '@mui/material'
import styled from '@emotion/styled'

export const Page = styled.main`
  width: 100%;
  padding: 0.5rem;
  margin-top: 5rem;
`

export const Communities = styled.div`
  display: grid;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0.5rem;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-row-gap: 0.5em;
  grid-column-gap: 1em;
`

export const Community = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
`
