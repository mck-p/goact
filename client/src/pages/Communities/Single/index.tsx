import React from 'react'
import { Typography } from '@mui/material'
import { useParams } from 'wouter'
import { useSelector } from 'react-redux'
import Log from '../../../log'
import { RootState } from '../../../state/store'
import { useGetCommunityByIDQuery } from '../../../state/domains/communities'
import { Page } from './components/styled'

const SingleCommunity = () => {
  const params = useParams()
  const { data, error, isLoading } = useGetCommunityByIDQuery(params.id!)

  if (isLoading) {
    return 'Loading...'
  }

  if (error) {
    Log.warn(
      { err: error, params: { id: params.id } },
      'There was an error when we tried to get the community',
    )
  }

  if (!data) {
    return 'No data'
  }

  return (
    <Page>
      <Typography variant="h2" gutterBottom align="center">
        {data.name}
      </Typography>
    </Page>
  )
}

const OnlyAuthenticatedSingle = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    return null
  }

  return <SingleCommunity />
}

export default OnlyAuthenticatedSingle
