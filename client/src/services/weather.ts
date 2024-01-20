import { CurrentWeatherDTO, TodaysWeatherDTO } from './weather.schema'

const ROOT_URL = 'http://localhost:8080/api/v1'

export const transformCurrentWeather = (current: any) => ({
  feelslike: {
    c: current.feelslike_c as number,
    f: current.feelslike_f as number,
  },
  condition: {
    text: current.condition.text,
    icon: current.condition.icon,
    code: current.condition.code,
  },
  cloud: current.cloud as number,
  gust: {
    mph: current.gust_mpg as number,
    kph: current.gust_kph as number,
  },
  humidity: current.humidity as number,
  last_updated: {
    date: current.last_updated as string,
    epoch: current.last_updated_epoch as number,
  },
  precip: {
    in: current.precip_in as number,
    mm: current.precip_mm as number,
  },
  pressure: {
    in: current.pressure_in as number,
    mb: current.pressure_mb as number,
  },
  temp: {
    c: current.temp_c as number,
    f: current.temp_f as number,
  },
  uv: current.uv as number,
  vis: {
    km: current.vis_km as number,
    miles: current.vis_miles as number,
  },
  wind: {
    degree: current.wind_degree as number,
    kph: current.wind_kph as number,
    mph: current.wind_mph as number,
    dir: current.wind_dir as string,
  },
})

export const transformForecastWeather = (forecast: any) => ({
  condition: {
    text: forecast.day.condition.text,
    icon: forecast.day.condition.icon,
    code: forecast.day.condition.code,
  },
  sun: {
    rise: forecast.astro.sunrise,
    set: forecast.astro.sunset,
    is_up: Boolean(forecast.astro.is_sun_up),
  },
  moon: {
    is_up: Boolean(forecast.astro.is_moon_up),
    rise: forecast.astro.moonrise,
    set: forecast.astro.moonset,
    phase: forecast.astro.moon_phase,
    illumination: forecast.astro.moon_illumination,
  },
  avg: {
    humidty: forecast.day.avghumidity,
    temp: {
      c: forecast.day.avgtemp_c,
      f: forecast.day.avgtemp_f,
    },
    vis: {
      km: forecast.day.avgvis_km,
      miles: forecast.day.avgvis_miles,
    },
  },
  min: {
    temp: {
      c: forecast.day.mintemp_c,
      f: forecast.day.mintemp_f,
    },
  },
  max: {
    temp: {
      c: forecast.day.maxtemp_c,
      f: forecast.day.maxtemp_f,
    },
    wind: {
      mph: forecast.day.maxwind_mph,
      kph: forecast.day.maxwind_kph,
    },
  },
  will: {
    rain: Boolean(forecast.day.daily_will_it_rain),
    snow: Boolean(forecast.day.daily_will_it_snow),
  },
  chance: {
    rain: forecast.day.daily_chance_of_rain,
    snow: forecast.day.daily_chance_of_snow,
  },
  total: {
    precip: {
      in: forecast.day.totalprecip_in,
      mm: forecast.day.totalprecip_mm,
    },
    snow: {
      cm: forecast.day.totalsnow_cm,
    },
  },
  uv: forecast.day.uv,
})

export const getCurrentWeather = async (
  query: string,
  token: string,
): Promise<{ current: CurrentWeatherDTO; today: TodaysWeatherDTO }> => {
  const result = await fetch(
    `${ROOT_URL}/weather?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return result.json().then((data: any) => {
    const current: CurrentWeatherDTO = transformCurrentWeather(data.current)
    const forecast = data.forecast.forecastday[0]
    const today: TodaysWeatherDTO = transformForecastWeather(forecast)

    return {
      today,
      current,
    }
  })
}
