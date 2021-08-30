require('dotenv').config()
const { User } = require('../../src/server/models')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../src/server/app')
const { equal, toBeNot, haveOwnProperties } = require('../utils/chai')
const {
  validateAccessToken,
  validateRefreshToken,
  getTokenFromDb,
} = require('../../src/server/services/tokens')
const { email, password } = require('../utils/const')

chai.use(chaiHttp)
// test
let token = ''

describe('Auth', () => {
  token = ''
  it('Clear DB', () =>
    new Promise((res) => User.destroy({ where: {}, force: true }).finally(res)))

  describe('Registration', () => {
    it('Should return 400 status and error message when email/password wrong', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post('/api/auth/registration')
          .send({ email: 'failed', password: '' })
          .end((_, res) => {
            equal(res.error.status, 400)
            equal(
              JSON.parse(res.error.text).message,
              'Email or password is wrong.'
            )

            resolve()
          })
      }))

    it('Should registrate new user if data is valid', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post('/api/auth/registration')
          .send({ email, password })
          .end((_, res) => {
            const { user, accessToken, refreshToken } = res.body

            toBeNot(validateAccessToken(accessToken), 'null')
            toBeNot(validateRefreshToken(refreshToken), 'null')
            haveOwnProperties(user, ['id', 'email', 'cities'])
            equal(user.email, email)

            resolve()
          })
      }))

    it('Should response forbidden if user already exist', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post('/api/auth/registration')
          .send({ email, password })
          .end((_, res) => {
            equal(res.error.status, 403)
            equal(
              JSON.parse(res.error.text).message,
              'This email is already used.'
            )

            resolve()
          })
      }))
  })

  describe('Login', () => {
    it('Should return 400 status and error message when email/password wrong', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post('/api/auth/login')
          .send({ email: 'failed', password: '' })
          .end((_, res) => {
            equal(res.error.status, 400)
            equal(
              JSON.parse(res.error.text).message,
              'Email or password is wrong.'
            )

            resolve()
          })
      }))

    it('Should return 400 status and error message when email is invalid', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post('/api/auth/login')
          .send({ email: 'invalid@gmail.com', password })
          .end((_, res) => {
            equal(res.error.status, 400)
            equal(
              JSON.parse(res.error.text).message,
              'Invalid email or password.'
            )

            resolve()
          })
      }))

    it('Should return 400 status and error message when passwor is wrong', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post('/api/auth/login')
          .send({ email, password: 'wrongPassword' })
          .end((_, res) => {
            equal(res.error.status, 400)
            equal(
              JSON.parse(res.error.text).message,
              'Invalid email or password.'
            )

            resolve()
          })
      }))

    it('Should authorize when email and password are correct', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post('/api/auth/login')
          .send({ email, password })
          .end((_, res) => {
            const { user, accessToken, refreshToken } = res.body
            token = refreshToken
            toBeNot(validateAccessToken(accessToken), 'null')
            toBeNot(validateRefreshToken(refreshToken), 'null')
            haveOwnProperties(user, ['id', 'email', 'cities'])
            equal(user.email, email)

            resolve()
          })
      }))
  })

  describe('Refresh Token', () => {
    it('Should return 401 error when token was not provided', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .get('/api/auth/refresh')
          .end((_, res) => {
            equal(res.error.status, 401)
            equal(JSON.parse(res.error.text).message, 'Token was not provided')

            resolve()
          })
      }))

    it('Should rewrite token to DB and return user data', async () => {
      try {
        const tokenFromDB = await getTokenFromDb(token)

        toBeNot(tokenFromDB, 'null')
      } catch (err) {
        console.log(err)
      }

      return new Promise((resolve) => {
        chai
          .request(server)
          .get('/api/auth/refresh')
          .set('Cookie', `refreshToken=${token}`)
          .end(async (_, res) => {
            const { user, accessToken, refreshToken } = res.body

            toBeNot(validateAccessToken(accessToken), 'null')
            toBeNot(validateRefreshToken(refreshToken), 'null')
            haveOwnProperties(user, ['id', 'email', 'cities'])
            equal(user.email, email)
            equal(token !== refreshToken, true)

            token = refreshToken

            resolve()
          })
      })
    })
  })

  describe('Logout', () => {
    it('Should return 500 error when token is not provided', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post('/api/auth/logout')
          .end((_, res) => {
            equal(res.error.status, 400)
            equal(
              JSON.parse(res.error.text).message,
              'Refresh token was not provided.'
            )

            resolve()
          })
      }))

    it('Should logs out when token was provided and remove token from DB', async () => {
      try {
        const tokenFromDB = await getTokenFromDb(token)

        toBeNot(tokenFromDB, 'null')
      } catch (err) {
        console.log(err)
      }

      return new Promise((resolve) => {
        chai
          .request(server)
          .post('/api/auth/logout')
          .set('Cookie', `refreshToken=${token}`)
          .end(async (_, res) => {
            try {
              const tokenFromDB = await getTokenFromDb(token)

              equal(tokenFromDB, null)
            } catch (err) {
              console.log('ERR', err)
            }

            resolve()
          })
      })
    })
  })
})
