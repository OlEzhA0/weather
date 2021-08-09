const Router = require('express')
const router = new Router()
const { body } = require('express-validator')

const { login, logout, registration, refresh } = require('../controllers/auth')

const validators = () => [
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 12 }),
]

router.post('/registration', ...validators(), registration)
router.post('/login', ...validators(), login)
router.post('/logout', logout)
router.get('/refresh', refresh)

module.exports = router
