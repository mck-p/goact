import React from 'react'
import { Switch, Route, Link, useRouter } from 'wouter'
import { useTranslation } from 'react-i18next'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Slide from '@mui/material/Slide'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'

import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-react'

function HideOnScroll(props: any) {
  const { children } = props

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const Title = () => {
  const { t: translations } = useTranslation()

  return (
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      <Switch>
        <Route path="/dashboard">{translations('title.dashboard')}</Route>
        <Route path="/profile">{translations('title.profile')}</Route>
        <Route path="/signup">{translations('title.signup')}</Route>
        <Route path="/signin">{translations('title.signin')}</Route>
        <Route path="/messages">{translations('title.messages')}</Route>
        <Route>{translations('title.not-found')}</Route>
      </Switch>
    </Typography>
  )
}

const SignedInButtons = ({ signOut }: { signOut: () => void }) => {
  const { t: translations } = useTranslation()

  return (
    <>
      <Switch>
        <Route path="/dashboard">
          <>
            <Link href="/profile">
              <Button>{translations('nav.buttons.profile.label')}</Button>
            </Link>
            <Link href="/messages">
              <Button>{translations('nav.buttons.messages.label')}</Button>
            </Link>
          </>
        </Route>
        <Route path="/profile">
          <>
            <Link href="/dashboard">
              <Button>{translations('nav.buttons.dashboard.label')}</Button>
            </Link>
            <Link href="/messages">
              <Button>{translations('nav.buttons.messages.label')}</Button>
            </Link>
          </>
        </Route>
        <Route path="/messages">
          <>
            <Link href="/dashboard">
              <Button>{translations('nav.buttons.dashboard.label')}</Button>
            </Link>
            <Link href="/profile">
              <Button>{translations('nav.buttons.profile.label')}</Button>
            </Link>
          </>
        </Route>
      </Switch>
      <Link href="/signout" onClick={signOut}>
        <Button>{translations('nav.buttons.signout.label')}</Button>
      </Link>
    </>
  )
}

const SignedOutButtons = () => {
  const { t: translations } = useTranslation()

  return (
    <Switch>
      <Route path="/signup">
        <Link href="/signin">
          <Button>{translations('nav.buttons.signin.label')}</Button>
        </Link>
      </Route>
      <Route path="/signin">
        <Link href="/signup">
          <Button>{translations('nav.buttons.signup.label')}</Button>
        </Link>
      </Route>
    </Switch>
  )
}

const Icon = () => {
  const { user } = useUser()
  const { t: translations } = useTranslation()

  return (
    <>
      <SignedIn>
        <Link href="/dashboard">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="dashboard"
            title="Dashboard"
          >
            <Avatar
              alt={translations('page.avatar.alt')}
              src={user?.imageUrl}
            />
          </IconButton>
        </Link>
      </SignedIn>
    </>
  )
}

const RightSideButtons = ({ signOut }: { signOut: () => void }) => (
  <>
    <SignedIn>
      <SignedInButtons signOut={signOut} />
    </SignedIn>
    <SignedOut>
      <SignedOutButtons />
    </SignedOut>
  </>
)

const TopBar = () => {
  const { signOut } = useClerk()

  return (
    <HideOnScroll>
      <AppBar>
        <Toolbar>
          <Icon />
          <Title />
          <RightSideButtons signOut={signOut} />
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}

export default TopBar
