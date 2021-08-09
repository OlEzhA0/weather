require('dotenv').config()
const { default: axios } = require('axios')

const APIError = require('../handlers/APIError')

const seaerchTypes = {
  id: 'id',
  name: 'q',
  zip: 'zip',
}

const getCity = async (req, res, next) => {
  const { searchValue, searchType } = req.params

  try {
    const { data } = await axios.get(
      `${process.env.API_ENDPOINT}?${seaerchTypes[searchType]}=${searchValue}&appid=${process.env.API_KEY}`
    )

    const { main, wind, sys, name: cityName, id } = data

    const cityInfo = { main, wind, sys, name: cityName, id: `${id}` }

    res.status(200).json({ params: cityInfo })
  } catch (err) {
    console.log(err)
    next(APIError.server('Something went wrong'))
  }
}

module.exports = { getCity }
