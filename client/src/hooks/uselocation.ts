import { useState, useEffect } from 'react'

export interface DefaultLocation {
  lat: number
  long: number
}

const useLocation = (
  fallback: DefaultLocation = {
    lat: 35.964668,
    long: -83.926453,
  },
) => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    long: number
  }>()

  useEffect(() => {
    let id: any
    if (!currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          })

          id = navigator.geolocation.watchPosition((position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              long: position.coords.longitude,
            })
          })
        },
        (err) => {
          setCurrentLocation(fallback)
        },
        { timeout: 1000 },
      )
    }

    return () => {
      if (id) {
        navigator.geolocation.clearWatch(id)
      }
    }
  }, [currentLocation, setCurrentLocation])

  return {
    location: currentLocation,
  }
}

export default useLocation
