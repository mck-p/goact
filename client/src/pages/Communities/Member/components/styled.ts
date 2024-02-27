import styled from '@emotion/styled'
import { List, Paper, Typography } from '@mui/material'

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

export const ProfileItems = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  grid-template-rows: auto;
  justify-content: center;
  grid-gap: 2.5rem;
  padding: 1.25rem;
`

export const EditableProfileItemDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.25rem;
`

export const EditableProfileItemForm = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
`

export const EditableProfileItemButtons = styled.div`
  display: flex;
`

export const EditableProfileItemHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0.5rem;
`

export const EditableProfileLabel = styled(Typography)``

export const EditableProfileItemData = styled.div`
  display: flex;
  flex-direction: column;
`
