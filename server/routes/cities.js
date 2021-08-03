const Router = require('express')
const router = new Router()

const { addCity, deleteCity } = require('../controllers/cities')
const authMiddleware = require('../middlewares/auth')

router.use(authMiddleware)
router.post('/add-city', addCity)
router.delete('/delete-city/:id', deleteCity)

module.exports = router
