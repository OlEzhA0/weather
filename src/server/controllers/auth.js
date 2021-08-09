require('dotenv').config()

const APIError = require('../handlers/APIError')
const AuthService = require('../services/auth')
const TokenService = require('../services/tokens')

class Auth {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email || !password || password.length < 7) {
        return next(APIError.userError('Email or password is wrong.'))
      }

      const user = await AuthService.registration(email, password)

      res.cookie('refreshToken', user.refreshToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      res.status(201).json(user)
    } catch (err) {
      next(APIError.server(err.message))
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
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      res.status(201).json(user)
    } catch (err) {
      next(APIError.server(err.message))
    }
  }

  async logout(req, res) {
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
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })

    res.status(201).json(user)
  }
}

module.exports = new Auth()
