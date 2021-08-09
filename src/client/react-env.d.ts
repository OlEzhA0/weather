interface User {
  id: string
  email: string
  cities: string[] | null
}

interface UserResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface City {
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  wind: {
    speed: number
    deg: number
    gust: number
  }
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  name: string
  id: string
}
