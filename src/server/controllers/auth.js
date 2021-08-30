require('dotenv').config()

const APIError = require('../handlers/APIError')
const AuthService = require('../services/auth')
const TokenService = require('../services/tokens')
const { Cities } = require('../models')

class Auth {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email || !password || password.length < 7) {
        return next(APIError.userError('Email or password is wrong.'))
      }

      const user = await AuthService.registration(email, password)
      console.log('USER FROM DB >>>', user)

      res.cookie('refreshToken', user.refreshToken, {
        maxAge: 1 * 24 * 60 * 60 * 1e3,
        httpOnly: true,
      })

      res.status(201).json(user)
    } catch (err) {
      next(APIError.forbidden(err.message))
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email || !password || password.length < 7) {
        next(APIError.userError('Email or password is wrong.'))
      }

      const user = await AuthService.login(email, password)

      res.cookie('refreshToken', user.refreshToken, {
        maxAge: 1 * 24 * 60 * 60 * 1e3,
        httpOnly: true,
      })

      res.status(201).json(user)
    } catch (err) {
      next(APIError.userError(err.message))
    }
  }

  async logout(req, res, next) {
    if (!req.cookies || !req.cookies.refreshToken) {
      return next(APIError.userError('Refresh token was not provided.'))
    }

    try {
      const { refreshToken } = req.cookies

      await TokenService.removeToken(refreshToken)

      res.clearCookie('refreshToken')

      res.status(200).json({ message: 'Success' })
    } catch (err) {
      next(APIError.server(err.message))
    }
  }

  async refresh(req, res, next) {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      return next(APIError.unauthorized('Token was not provided'))
    }

    const user = await AuthService.refresh(refreshToken)
    res.cookie('refreshToken', user.refreshToken, {
      maxAge: 1 * 24 * 60 * 60 * 1e3,
      httpOnly: true,
    })

    res.status(201).json(user)
  }

  async getUser(req, res, next) {
    const { user } = req

    try {
      const { cities } = await Cities.findOne({ where: { userId: user.id } })

      res.status(200).json({ user: { ...req.user, cities } })
    } catch (err) {
      next(APIError.unauthorized(err.message))
    }
  }
}

module.exports = new Auth()
