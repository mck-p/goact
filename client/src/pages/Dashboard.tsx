import React from 'react'
import { Divider, Typography } from '@mui/material'
import { useUser, useSession } from '@clerk/clerk-react'
import styled from '@emotion/styled'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import MessageIcon from '@mui/icons-material/Message'
import CardHeader from '@mui/material/CardHeader'
import ContactsIcon from '@mui/icons-material/Contacts'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { useTranslation } from 'react-i18next'
import { Link } from 'wouter'
import Weather from '../components/Weather'
import InspirationalQuote from '../components/InspirationalQuote'

import OnlyAuthenticated from '../components/OnlyAuthenticated'
import MessageList from '../components/MessageList'

const Page = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
`

const Cards = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
`

const DashboardCard = styled(Card)`
  margin: 1rem;
`

const TopCards = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;

  @media (max-width: 1250px) {
    flex-direction: column;
  }
`

const cards = [
  {
    title: 'page.dashboard.card.messages.title',
    icon: <MessageIcon />,
    root: '/messages',
    component: <MessageList mostRecent />,
  },
  {
    title: 'page.dashboard.card.contacts.title',
    icon: <ContactsIcon />,
    root: '/contacts',
  },
]

const topCards = [
  {
    title: 'page.dashbaord.card.weather.title',
    widget: <Weather key="weather" />,
  },
  {
    title: 'page.dashboard.card.quote.title',
    widget: <InspirationalQuote key="quote" />,
  },
]

const Dashboard = () => {
  const { user } = useUser()
  const { t: translations } = useTranslation()

  if (!user) {
    return null
  }

  return (
    <Page>
      <Cards>
        <TopCards>{topCards.map((card) => card.widget)}</TopCards>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry>
            {cards.map((card, i) => (
              <DashboardCard key={i}>
                <CardHeader
                  avatar={
                    <Link href={card.root}>
                      <IconButton>{card.icon}</IconButton>
                    </Link>
                  }
                  title={translations(card.title)}
                  aria-label={translations(card.title)}
                />
                <Divider variant="middle" />
                <CardContent>{card.component}</CardContent>
              </DashboardCard>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </Cards>
    </Page>
  )
}

export default OnlyAuthenticated(Dashboard)
