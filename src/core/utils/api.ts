import axios from 'axios'

import { TOKEN } from 'core/const'

const API_URL = `${process.env.MAIN}/api`

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${window.localStorage.getItem(TOKEN)}`

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

        await api.request(err.config)
      } catch (e) {
        console.log('Unauthorized')
      }
    }
  }
)

export { api }
