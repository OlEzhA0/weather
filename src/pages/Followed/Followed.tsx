import React, { FC, useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

import PageTitle from 'core/layout/PageTitle'
import { useAuthContext } from 'core/context/AuthContext'
import { api } from 'core/utils/api'
import City from 'features/City'
import Navbar from 'features/Navbar'

const cityRequest = async (id: string): Promise<City> => {
  const { data } = await api.get<{ params: City }>(`/weather/get-city/id/${id}`)

  return data.params
}

const Followed: FC = () => {
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState<City[]>([])

  const { user } = useAuthContext()

  useEffect(() => {
    const getCities = async () => {
      console.log('ininini')
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
    <PageTitle title="Followed cities">
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
    </PageTitle>
  )
}

export default Followed
