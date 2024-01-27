import React from 'react'
import { UserProfile } from '@clerk/clerk-react'
import styled from '@emotion/styled'


const Page = styled.main`
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5rem;
`

const Profile = () => (
  <Page>
    <UserProfile />
  </Page>
)

export default Profile
