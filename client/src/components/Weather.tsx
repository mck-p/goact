import React, { useEffect, useState } from 'react'
import { Avatar, Typography } from '@mui/material'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import AirIcon from '@mui/icons-material/Air'
import Divider from '@mui/material/Divider'

import Paper from '@mui/material/Paper'

import styled from '@emotion/styled'

import * as WeatherAPI from '../services/weather'
import useLocation from '../hooks/uselocation'

import { CurrentWeatherDTO, TodaysWeatherDTO } from '../services/weather.schema'
import { useTranslation } from 'react-i18next'
import { useSession } from '@clerk/clerk-react'

const WeatherFallback = () => <Typography>No geolocation found</Typography>

interface WeatherFetchProps {
  everyMs?: number
}

const WeatherInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem;

  @media (max-width: 1250px) {
    flex-direction: column;
  }
`

const TempList = styled.div`
  display: flex;
  justify-content: space-between;
`

const Temp = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`

const Conditions = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
`

const WeatherWidget = styled(Paper)`
  display: flex;
  align-items: center;
`

const WeatherIcon = styled(Avatar)`
  margin-left: 1rem;
`

const Wind = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`

const WindInfo = styled.div`
  display: flex;

  .MuiTypography-root {
    margin-left: 1rem;
  }
`

const TempInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const WeatherEnabled = (props: WeatherFetchProps) => {
  const { location } = useLocation()
  const { isLoaded, session, isSignedIn } = useSession()
  const [weather, setWeather] = useState<CurrentWeatherDTO>()
  const [forecast, setForecast] = useState<TodaysWeatherDTO>()
  const [lastFetched, setLastFetched] = useState(0)
  const { t: translations } = useTranslation()

  useEffect(() => {
    const handle = async () => {
      const maxAllowed = 1000 * 60 * 15
      if (
        location &&
        Date.now() - lastFetched > (props.everyMs || maxAllowed)
      ) {
        const token = await session?.getToken()

        if (token) {
          const result = await WeatherAPI.getCurrentWeather(
            `${location?.lat},${location?.long}`,
            token,
          )

          setWeather(result.current)
          setForecast(result.today)
        }

        // Even if we don't have a token, I want
        // to keep from trying to call the API in
        // a deadloop
        setLastFetched(Date.now())
      }
    }

    handle()
  }, [location, setWeather, lastFetched, session])

  if (!weather || !forecast || !isLoaded || !isSignedIn) {
    return null
  }

  return (
    <WeatherWidget elevation={2}>
      <WeatherInfo>
        <ThermostatIcon />
        <TempInfo>
          <TempList>
            <Temp>
              <Typography>
                {translations('widgets.weather.feelslike.label')}
              </Typography>
              <Typography variant="caption">
                {weather.feelslike.c} C &deg;
              </Typography>
              <Typography variant="caption">
                {weather.feelslike.f} F &deg;
              </Typography>
            </Temp>
            <Temp>
              <Typography>
                {translations('widgets.weather.actul.label')}
              </Typography>

              <Typography variant="caption">
                {weather.temp.c} C &deg;
              </Typography>
              <Typography variant="caption">
                {weather.temp.f} F &deg;
              </Typography>
            </Temp>
            <Conditions>
              <Typography variant="subtitle2">
                {weather.condition.text}
              </Typography>
              <WeatherIcon
                alt={weather.condition.text}
                src={weather.condition.icon}
              />
            </Conditions>
          </TempList>
          <TempList>
            <Temp>
              <Typography>
                {translations('widgets.weather.today.label')}
              </Typography>
              <Typography variant="caption">
                {translations('widgets.weather.today.temp.label')}{' '}
                {forecast.avg.temp.c} C &deg; / {forecast.avg.temp.f} F &deg;
              </Typography>
              <Typography variant="caption">
                {translations('widgets.weather.today.high.label')}{' '}
                {forecast.max.temp.c} C &deg; / {forecast.max.temp.f} F &deg;
              </Typography>
              <Typography variant="caption">
                {translations('widgets.weather.today.low.label')}{' '}
                {forecast.min.temp.c} C &deg; / {forecast.min.temp.f} F &deg;
              </Typography>
              <Typography variant="caption">
                {translations('widgets.weather.today.humidty.label')}{' '}
                {forecast.avg.humidty}
              </Typography>
              <Typography variant="caption">
                {translations('widgets.weather.today.sunrise.label')}{' '}
                {forecast.sun.rise}
              </Typography>
              <Typography variant="caption">
                {translations('widgets.weather.today.sunset.label')}{' '}
                {forecast.sun.set}
              </Typography>
            </Temp>
            <Conditions>
              <Typography variant="subtitle2">
                {forecast.condition.text}
              </Typography>
              <WeatherIcon
                alt={forecast.condition.text}
                src={forecast.condition.icon}
              />
            </Conditions>
          </TempList>
        </TempInfo>
        <Divider variant="middle" flexItem />
        <Wind>
          <AirIcon />
          <WindInfo>
            <Typography>{weather.wind.dir}</Typography>
            <Typography>
              {weather.wind.mph} mph / {weather.wind.kph} kph{' '}
            </Typography>
          </WindInfo>
        </Wind>
      </WeatherInfo>
    </WeatherWidget>
  )
}

const Weather = () => {
  const hasGeoLocation = 'geolocation' in navigator

  if (!hasGeoLocation) {
    return <WeatherFallback />
  }

  return <WeatherEnabled />
}

export default Weather
