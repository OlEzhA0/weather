const Router = require('express')

const router = new Router()
const auth = require('./auth')
const cities = require('./cities')
const weather = require('./weather')

router.use('/auth', auth)
router.use('/weather', weather)
router.use('/cities', cities)

module.exports = router
