import React, { FC, useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

import City from 'client/features/City'
import Navbar from 'client/features/Navbar'
import { useAuthContext } from 'client/core/context/AuthContext'
import { api } from 'client/core/api'
import { useTabTitle } from 'client/core/hooks/useTabTitle'

const cityRequest = async (id: string): Promise<City> => {
  const { data } = await api.get<{ params: City }>(`/weather/get-city/id/${id}`)

  return data.params
}

const Followed: FC = () => {
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState<City[]>([])

  const { user } = useAuthContext()

  useTabTitle('Followed cities')

  useEffect(() => {
    const getCities = async () => {
      setLoading(true)

      const promises = []

      const userCities = user?.cities || []

      for (let i = 0; i < userCities.length; i++) {
        promises.push(cityRequest(userCities[i]))
      }

      try {
        const results = await Promise.all(promises)

        setCities(results)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    if (user && user.cities?.length && !cities.length) {
      getCities()
    }
  }, [user, cities])

  useEffect(() => {
    if (cities.length) {
      const filteredCities = cities.filter((city) =>
        user?.cities?.some((userCityId) => userCityId === city.id)
      )

      if (filteredCities.length !== cities.length) {
        setCities(filteredCities)
      }
    }
  }, [user, cities])

  if (!user) {
    return <Redirect to="/sign-in" />
  }

  const renderedNoCity = (!user.cities || !user.cities.length) && (
    <>
      <p>Cities not added yet</p>
      <Link to="/search">Add city</Link>
    </>
  )

  const renderedCities =
    cities.length > 0 &&
    cities.map((city) => <City key={city.id} city={city} />)

  return (
    <>
      <h1>Followed</h1>

      <Navbar />

      {loading && !cities.length ? (
        <p>Loading...</p>
      ) : (
        <>
          {renderedNoCity}
          {renderedCities}
        </>
      )}
    </>
  )
}

export default Followed
