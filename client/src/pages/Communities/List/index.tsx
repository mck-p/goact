import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'wouter'
import { Button, Typography } from '@mui/material'

const Page = styled.main`
  width: 100%;
  padding: 0.5rem;
  margin-top: 5rem;
`

const ListCommunities = () => (
  <Page>
    <Typography>Hello, world!</Typography>
    <Link href="/communities/create">
      <Button color="primary">Create New Community</Button>
    </Link>
  </Page>
)

export default ListCommunities
