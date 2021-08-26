require('dotenv').config()
const { hash, compareSync } = require('bcrypt')

const APIError = require('../handlers/APIError')
const { User, Cities } = require('../models')
const {
  generateTokens,
  saveToken,
  validateRefreshToken,
  getTokenFromDb,
} = require('./tokens')

class AuthService {
  async generateTokensAndSave(user, cities) {
    try {
      const payload = { id: user.id, email: user.email }
      const tokens = generateTokens(payload)

      await saveToken(payload.id, tokens.refreshToken)

      return { ...tokens, user: { ...payload, cities } }
    } catch (err) {
      throw APIError.server('Something went wrong')
    }
  }

  async registration(email, password) {
    try {
      const isUserExist = await User.findOne({ where: { email } })

      if (isUserExist) {
        throw APIError.forbidden('This email is already used.')
      }

      const hashedPassword = await hash(password, +process.env.SALT)
      const user = await User.create({ email, password: hashedPassword })
      const { cities } = await Cities.create({ userId: user.id })

      return await this.generateTokensAndSave(user, cities)
    } catch (err) {
      throw APIError.forbidden(err.message)
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        throw APIError.userError('Invalid email or password.')
      }

      const comparePass = compareSync(password, user.password)

      if (!comparePass) {
        throw APIError.userError('Invalid email or password.')
      }

      const { cities } = await Cities.findOne({ where: { userId: user.id } })

      return await this.generateTokensAndSave(user, cities)
    } catch (err) {
      throw APIError.userError(err.message)
    }
  }

  async refresh(refreshToken) {
    const userData = validateRefreshToken(refreshToken)
    const tokenFromDb = await getTokenFromDb(refreshToken)

    try {
      if (!userData || !tokenFromDb || refreshToken !== tokenFromDb.token) {
        throw APIError.unauthorized('Token invalid')
      }

      const user = await User.findOne({ where: { id: userData.id } })
      const { cities } = await Cities.findOne({
        where: { userId: userData.id },
      })

      return await this.generateTokensAndSave(user, cities)
    } catch (err) {
      throw APIError.unauthorized(err.message)
    }
  }
}

module.exports = new AuthService()
