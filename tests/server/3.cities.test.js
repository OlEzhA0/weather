require('dotenv').config()
const { User } = require('../../src/server/models')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../src/server/app')
const { equal, toBeNot, haveOwnProperties } = require('../utils/chai')
const { cityId, email, password } = require('../utils/const')
const {
  validateAccessToken,
  validateRefreshToken,
} = require('../../src/server/services/tokens')

chai.use(chaiHttp)

let token = ''

describe('Cities', () => {
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

  describe('Add city', () => {
    it('Should return unauthorized error when access token was not provided', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post(`/api/cities/add-city`)
          .send({ id: '1' })
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
          .post(`/api/cities/add-city`)
          .send({ id: '1' })
          .set('authorization', 'Bearer invalid')
          .end((_, res) => {
            const { status, text } = res.error

            equal(status, 401)
            equal(JSON.parse(text).message, 'Access token is invalid')

            resolve()
          })
      }))

    it('Should add city to user cities stack', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post(`/api/cities/add-city`)
          .send({ id: cityId })
          .set('authorization', `Bearer ${token}`)
          .end(() => {
            chai
              .request(server)
              .get('/api/auth/get-user')
              .set('authorization', `Bearer ${token}`)
              .end((_, { body }) => {
                const { cities } = body.user

                equal(cities.length === 1)

                resolve()
              })
          })
      }))

    it('Should not add city to stack if it is was added', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post(`/api/cities/add-city`)
          .send({ id: cityId })
          .set('authorization', `Bearer ${token}`)
          .end((_, res) => {
            const { status, text } = res.error

            equal(status, 400)
            equal(JSON.parse(text).message, 'This city is already added')

            resolve()
          })
      }))

    it('Should add city with different id', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .post(`/api/cities/add-city`)
          .send({ id: '2' })
          .set('authorization', `Bearer ${token}`)
          .end((_, res) => {
            chai
              .request(server)
              .get('/api/auth/get-user')
              .set('authorization', `Bearer ${token}`)
              .end((_, { body }) => {
                const { cities } = body.user

                equal(cities.length === 2)
                equal(cities.includes(cityId) && cities.includes('2'))

                resolve()
              })
          })
      }))
  })

  describe('Delete city', () => {
    it('Should return unauthorized error when access token was not provided', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .delete(`/api/cities/delete-city/${cityId}`)
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
          .delete(`/api/cities/delete-city/${cityId}`)
          .set('authorization', 'Bearer invalid')
          .end((_, res) => {
            const { status, text } = res.error

            equal(status, 401)
            equal(JSON.parse(text).message, 'Access token is invalid')

            resolve()
          })
      }))

    it('Should delete item when data is valid', () =>
      new Promise((resolve) => {
        chai
          .request(server)
          .delete(`/api/cities/delete-city/${cityId}`)
          .set('authorization', `Bearer ${token}`)
          .end(() => {
            chai
              .request(server)
              .get('/api/auth/get-user')
              .set('authorization', `Bearer ${token}`)
              .end((_, { body }) => {
                const { cities } = body.user

                equal(cities.length === 1)
                equal(!cities.includes(cityId))

                resolve()
              })
          })
      }))
  })
})
