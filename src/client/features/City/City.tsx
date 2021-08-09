import React, { FC, useMemo, useState } from 'react'

import { kelvinToCelsius } from 'client/core/utils/kelvinToCelsius'
import { useAuthContext } from 'client/core/context/AuthContext'
import { api } from 'client/core/api'

interface Props {
  city: City
}

const City: FC<Props> = ({ city }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { user, updateUserInfo } = useAuthContext()

  const isCityAdded = useMemo(
    () => (user?.cities || []).some((cityId) => cityId === city.id),
    [user, city.id]
  )

  if (!user) {
    return null
  }

  const handleFollowCity = async () => {
    try {
      await api.post('/cities/add-city', { id: city.id })

      updateUserInfo({ cities: [...(user.cities || []), city.id] })
    } catch (err) {
      setError(err.response.data.message || err.message || err)
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollowCity = async () => {
    try {
      await api.delete(`/cities/delete-city/${city.id}`)

      updateUserInfo({
        cities: (user.cities || []).filter((id) => id !== city.id),
      })
    } catch (err) {
      setError(err.response.data.message || err.message || err)
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchCityStatus = () => {
    setLoading(true)
    setError('')

    const switcher = isCityAdded ? handleUnfollowCity : handleFollowCity

    switcher()
  }

  return (
    <div className="City">
      <h3>{city.name}</h3>
      <p>
        Temp: <span>{kelvinToCelsius(city.main.temp)}°C</span>
      </p>
      <p>
        Temp min: <span>{kelvinToCelsius(city.main.temp_min)}°C</span>
      </p>
      <p>
        Temp max: <span>{kelvinToCelsius(city.main.temp_max)}°C</span>
      </p>
      <p>
        Wind speed: <span>{city.wind.speed} m/sec</span>
      </p>
      <p>
        Country:<span>{city.sys.country}</span>
      </p>

      <br />

      <button onClick={handleSwitchCityStatus} disabled={loading}>
        {isCityAdded ? 'Unfollow' : 'Follow'}
      </button>

      {error && <p>{error}</p>}
    </div>
  )
}

export default City
