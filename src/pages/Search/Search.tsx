import React, { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

import PageTitle from 'core/layout/PageTitle'
import { useAuthContext } from 'core/context/AuthContext'
import { api } from 'core/utils/api'
import City from 'features/City'
import Navbar from 'features/Navbar'

const Search: FC = () => {
  const [loading, setLoading] = useState(false)
  const [foundCity, setFoundCity] = useState<City | null>(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const { user, loading: userLoading } = useAuthContext()

  if (!user && !userLoading) {
    return <Redirect to="/sign-in" />
  }

  const handleSetSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value)

  const handleSearchCity = async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)

    try {
      const { data } = await api.get<{ params: City }>(
        `/weather/get-city/name/${search}`
      )

      setFoundCity(data.params)
    } catch (err) {
      console.log(err)

      setError(err.message || err)
      setFoundCity(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTitle title="Followed cities">
      <h1>Search city</h1>
      <Navbar />
      <br />
      <form onSubmit={handleSearchCity}>
        <input
          type="text"
          placeholder="Type City Name 'Dnipro'..."
          value={search}
          onChange={handleSetSearch}
        />

        <button type="submit" disabled={!search || loading}>
          Search
        </button>
      </form>

      {error && (
        <>
          <p>{error}</p>
          <Link to="/followed">My followed cities</Link>
        </>
      )}
      {loading && <p>Loading...</p>}

      {foundCity && !loading && <City city={foundCity} />}
    </PageTitle>
  )
}

export default Search
