require('dotenv').config()
const { User } = require('../../src/server/models')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../src/server/app')
const { equal, toBeNot, haveOwnProperties } = require('../utils/chai')
const { cityName, email, password } = require('../utils/const')
const {
  validateAccessToken,
  validateRefreshToken,
} = require('../../src/server/services/tokens')

chai.use(chaiHttp)

let token = ''

describe('Weather', () => {
  token = ''
  it('Login into account', () =>
    new Promise((resolve) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({ email, password })
        .end((_, res) => {
          const { user, accessToken, refreshToken } = res.body
          toBeNot(validateAccessToken(accessToken), 'null')
          toBeNot(validateRefreshToken(refreshToken), 'null')
          haveOwnProperties(user, ['id', 'email', 'cities'])
          equal(user.email, email)
          token = accessToken

          resolve()
        })
    }))

  it('Should return unauthorized error when access token was not provided', () =>
    new Promise((resolve) => {
      chai
        .request(server)
        .get(`/api/weather/get-city/q/${cityName}`)
        .end((_, res) => {
          const { status, text } = res.error

          equal(status, 401)
          equal(
            JSON.parse(text).message,
            'Authorization header was not provided'
          )

          resolve()
        })
    }))

  it('Should return unauthorized error when access token is invalid', () =>
    new Promise((resolve) => {
      chai
        .request(server)
        .get(`/api/weather/get-city/q/${cityName}`)
        .set('authorization', 'Bearer invalid')
        .end((_, res) => {
          const { status, text } = res.error

          equal(status, 401)
          equal(JSON.parse(text).message, 'Access token is invalid')

          resolve()
        })
    }))

  it('Should return city info when data is correct', () =>
    new Promise((resolve) => {
      chai
        .request(server)
        .get(`/api/weather/get-city/name/${cityName}`)
        .set('authorization', `Bearer ${token}`)
        .end((_, res) => {
          const { params } = res.body

          haveOwnProperties(params, ['id', 'name', 'sys', 'wind', 'main'])

          resolve()
        })
    }))

  it('Should return error when city name is falsy', () =>
    new Promise((resolve) => {
      chai
        .request(server)
        .get(`/api/weather/get-city/name/testName`)
        .set('authorization', `Bearer ${token}`)
        .end((_, res) => {
          const { status } = res.error

          equal(status, 500)

          resolve()
        })
    }))
})
