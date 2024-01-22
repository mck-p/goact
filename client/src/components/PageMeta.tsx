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
          <title>{translations('title.dashboard')} | Christ Like</title>
        </Helmet>
      </Route>
      <Route path="/profile">
        <Helmet>
          <title>{translations('title.profile')} | Christ Like</title>
        </Helmet>
      </Route>
      <Route path="/signup">
        <Helmet>
          <title>{translations('title.signup')} | Christ Like</title>
        </Helmet>
      </Route>
      <Route path="/signin">
        <Helmet>
          <title>{translations('title.signin')} | Christ Like</title>
        </Helmet>
      </Route>
    </Switch>
  )
}

export default PageMeta