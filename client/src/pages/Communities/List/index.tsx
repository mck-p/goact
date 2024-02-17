import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'wouter'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from '@mui/material'

import { useGetCommunitiesQuery } from '../../../state/domains/communities'
import { RootState } from '../../../state/store'
import { Page, Communities, Community } from './components/styled'

const ListCommunities = () => {
  const { data, isLoading } = useGetCommunitiesQuery()
  const { t } = useTranslation()

  if (isLoading) {
    return '...loading'
  }

  return (
    <Page>
      <Typography>{t('page.communities.list.title')}</Typography>
      <Communities>
        {data?.map(({ _id, name, is_public }) => (
          <Community key={_id}>
            <Typography variant="h4">{name}</Typography>
            <Typography>Is public {is_public ? 'yes' : 'no'}</Typography>
            <Link href={`/communities/${_id}`}>
              <Button variant="contained">See Community</Button>
            </Link>
          </Community>
        ))}
      </Communities>
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
