import axios from 'axios'

import { TOKEN } from 'core/const'

const API_URL = `${process.env.MAIN}/api`

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    window.dispatchEvent(new Event('storage'))
  }

  return config
})

api.interceptors.response.use(
  (config) => config,
  async (err) => {
    let canRetry = true

    if (err.response.status == 401 && err.config && canRetry) {
      canRetry = false

      try {
        const { data } = await axios.get<UserResponse>(
          `${API_URL}/auth/refresh`,
          { withCredentials: true }
        )

        localStorage.setItem(TOKEN, data.accessToken)

        return api.request(err.config)
      } catch (e) {
        window.localStorage.removeItem(TOKEN)
        window.dispatchEvent(new Event('storage'))

        throw new Error('Unauthorized')
      }
    }
  }
)

export { api }
