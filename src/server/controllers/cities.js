require('dotenv').config()
const APIError = require('../handlers/APIError')
const { Cities } = require('../models')

class City {
  async addCity(req, res, next) {
    const { user } = req
    const { id } = req.body

    try {
      const foundCities = await Cities.findOne({ where: { userId: user.id } })
      const isCityAdded = (foundCities.cities || []).some(
        (cityId) => cityId === id
      )

      if (isCityAdded) {
        return next(APIError.userError('This city is already added'))
      }

      await foundCities.update({ cities: [...(foundCities.cities || []), id] })

      res.status(200).json({ foundCities })
    } catch (err) {
      next(APIError.server('Something went wrong.'))
    }
  }

  async deleteCity(req, res, next) {
    const { user } = req
    const { id } = req.params

    try {
      const foundCities = await Cities.findOne({ where: { userId: user.id } })

      await foundCities.update({
        cities: (foundCities.cities || []).filter((cityId) => cityId !== id),
      })

      res.status(200).json({ foundCities })
    } catch (err) {
      next(APIError.server('Something went wrong.'))
    }
  }
}

module.exports = new City()
