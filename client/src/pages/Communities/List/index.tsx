import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'wouter'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@mui/material'
import { useGetCommunitiesQuery } from '../../../state/domains/communities'
import { useSelector } from 'react-redux'
import { RootState } from '../../../state/store'

const Page = styled.main`
  width: 100%;
  padding: 0.5rem;
  margin-top: 5rem;
`

const ListCommunities = () => {
  const { data, error, isLoading, isFetching } = useGetCommunitiesQuery()
  const { t } = useTranslation()

  if (isLoading) {
    return '...loading'
  }

  console.log(data, error, isFetching)

  return (
    <Page>
      <Typography>{t('page.communities.list.title')}</Typography>
      {data?.map(({ _id, name, is_public }) => (
        <div key={_id}>
          <Typography>{name}</Typography>
          <Typography>Is public{is_public ? 'yes' : 'no'}</Typography>
        </div>
      ))}
      <Link href="/communities/create">
        <Button color="primary">Create New Community</Button>
      </Link>
    </Page>
  )
}

const OnlyAuthenticatedList = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    return null
  }

  return <ListCommunities />
}

export default OnlyAuthenticatedList
