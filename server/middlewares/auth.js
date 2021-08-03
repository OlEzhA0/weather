require('dotenv').config()

const { validateAccessToken } = require('../services/tokens')
const APIError = require('../errors/APIError')

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    const token = (authorization || '').split(' ')[1]

    if (!token) {
      next(APIError.unauthorized('Authorization header was not provided'))
    }

    const decodedJwt = validateAccessToken(token)

    if (!decodedJwt) {
      next(APIError.unauthorized('Access token is invalid'))
    }

    req.user = decodedJwt

    next()
  } catch (err) {
    next(APIError.server('Something went wrong'))
  }
}

module.exports = authMiddleware
