require('dotenv').config()
const jwt = require('jsonwebtoken')

const { Token } = require('../models')

const generateJWT = (payload, type) => {
  if (type === 'access') {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15s',
    })
  }

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  })
}

class TokenService {
  generateTokens(payload) {
    const tokens = {
      accessToken: generateJWT(payload, 'access'),
      refreshToken: generateJWT(payload),
    }

    return tokens
  }

  async saveToken(userId, refreshToken) {
    try {
      const tokenFromDb = await Token.findOne({ where: { userId } })

      if (tokenFromDb) {
        tokenFromDb.token = refreshToken

        await tokenFromDb.save()

        return
      }

      await Token.create({ userId, token: refreshToken })
    } catch (err) {
      throw new Error('Can`t save token')
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const tokenData = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      )

      return tokenData
    } catch {
      return null
    }
  }

  validateAccessToken(accessToken) {
    try {
      const tokenData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

      return tokenData
    } catch {
      return null
    }
  }

  async removeToken(token) {
    try {
      await Token.destroy({
        where: { token },
        force: true,
      })
    } catch {
      throw new Error('Can`t remove token')
    }
  }

  async getTokenFromDb(token) {
    try {
      const foundToken = await Token.findOne({ where: { token } })

      return foundToken
    } catch {
      throw new Error('Can`t get token')
    }
  }
}

module.exports = new TokenService()
