import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Switch, Route } from 'wouter'

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
    </Switch>
  )
}

export default PageMeta
