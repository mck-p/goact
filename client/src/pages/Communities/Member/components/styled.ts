import styled from '@emotion/styled'
import { List, Paper } from '@mui/material'

export const Page = styled.div`
  width: 100%;
  padding: 0.5rem;
  margin-top: 5rem;
`

export const Avatar = styled.img`
  width: 164px;
  height: 164px;
  border-radius: 50%;
  overflow: hidden;
`

export const Profile = styled(Paper)`
  padding: 2.5rem;
  width: 95%;
  margin: 0 auto;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${Avatar} {
    margin-bottom: 2.5rem;
  }
`

export const Lists = styled.div`
  display: flex;
`
