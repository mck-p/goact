import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Switch, Route, useParams } from 'wouter'
import { useGetCommunityByIDQuery } from '../state/domains/communities'

const CommunityTitle = () => {
  const params = useParams()
  const { data } = useGetCommunityByIDQuery(params.id!)

  if (data) {
    return (
      <Helmet>
        <title>{data.name} | Goact</title>
      </Helmet>
    )
  }
}

const PageMeta = () => {
  const { t: translations } = useTranslation()

  return (
    <Switch>
      <Route path="/dashboard">
        <Helmet>
          <title>{translations('title.dashboard')} | Goact</title>
        </Helmet>
      </Route>
      <Route path="/profile">
        <Helmet>
          <title>{translations('title.profile')} | Goact</title>
        </Helmet>
      </Route>
      <Route path="/signup">
        <Helmet>
          <title>{translations('title.signup')} | Goact</title>
        </Helmet>
      </Route>
      <Route path="/signin">
        <Helmet>
          <title>{translations('title.signin')} | Goact</title>
        </Helmet>
      </Route>
      <Route path="/messages">
        <Helmet>
          <title>{translations('title.messages')} | Goact</title>
        </Helmet>
      </Route>
      <Route path="/communities">
        <Helmet>
          <title>{translations('title.communities')} | Goact</title>
        </Helmet>
      </Route>
      <Route path="/communities/create">
        <Helmet>
          <title>{translations('title.createCommunities')} | Goact</title>
        </Helmet>
      </Route>
      <Route path="/communities/:id">
        <CommunityTitle />
      </Route>
    </Switch>
  )
}

export default PageMeta
