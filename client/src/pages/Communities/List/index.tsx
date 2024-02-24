import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'wouter'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from '@mui/material'

import { useLazyGetCommunitiesQuery } from '../../../state/domains/communities'
import { Page, Communities, Community } from './components/styled'
import { useSession } from '@clerk/clerk-react'

const ListCommunities = () => {
  const [trigger, result, lastPromiseInfo] = useLazyGetCommunitiesQuery()
  const { session } = useSession()

  const { t } = useTranslation()

  useEffect(() => {
    if (session) {
      session?.getToken().then((token) => {
        if (token) {
          trigger({
            token,
          })
        }
      })
    }
  }, [session])

  if (result.status !== 'fulfilled') {
    return 'Loading...'
  }

  return (
    <Page>
      <Typography>{t('page.communities.list.title')}</Typography>
      <Communities>
        {result.currentData?.map(({ _id, name, is_public }) => (
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

export default ListCommunities
