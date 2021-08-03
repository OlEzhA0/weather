const Router = require('express')

const router = new Router()
const authMiddleware = require('../middlewares/auth')
const { getCity } = require('../controllers/weather')

router.use(authMiddleware)
router.get('/get-city/:searchType/:searchValue', getCity)

module.exports = router
