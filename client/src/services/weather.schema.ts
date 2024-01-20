export interface CurrentWeatherDTO {
  cloud: number
  condition: {
    text: string
    icon: string
    code: number
  }
  feelslike: {
    f: number
    c: number
  }
  gust: {
    mph: number
    kph: number
  }
  humidity: number
  last_updated: {
    date: string
    epoch: number
  }
  precip: {
    in: number
    mm: number
  }
  pressure: {
    in: number
    mb: number
  }
  temp: {
    c: number
    f: number
  }
  uv: number
  vis: {
    km: number
    miles: number
  }
  wind: {
    degree: number
    dir: string
    kph: number
    mph: number
  }
}

export interface TodaysWeatherDTO {
  sun: {
    rise: string
    set: string
    is_up: boolean
  }
  condition: {
    text: string
    icon: string
    code: number
  }
  moon: {
    rise: string
    set: string
    phase: string
    illumination: number
    is_up: boolean
  }
  avg: {
    humidty: number
    temp: {
      c: number
      f: number
    }
    vis: {
      km: number
      miles: number
    }
  }
  min: {
    temp: {
      c: number
      f: number
    }
  }
  max: {
    temp: {
      c: number
      f: number
    }
    wind: {
      kph: number
      mph: number
    }
  }
  will: {
    rain: boolean
    snow: boolean
  }
  chance: {
    rain: number
    snow: number
  }
  total: {
    precip: {
      in: number
      mm: number
    }
    snow: {
      cm: number
    }
  }
  uv: number
}
