require('dotenv').config()
const express = require('express')
const app = express()
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 3005

const devConfig = require('../../webpack.config')
const prodConfig = require('../../webpack.prod.config')
const config = process.env.NODE_ENV === 'development' ? devConfig : prodConfig
const compiler = webpack(config)
const sequelize = require('./db_init')
const router = require('./routes')
const errorHandler = require('./middlewares/error')

app.use(
  cors({
    credentials: true,
    origin: process.env.MAIN,
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(
  require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
  })
)

app.use(webpackHotMiddleware(compiler))

app.use('/api', router)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../../dist'))
}

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', '../', 'build', 'index.html'))
})

app.use(errorHandler)

// INIT
;(async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    app.listen(port, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`> Listening on port: ${port}`)
        console.log(`> Environment: ${process.env.NODE_ENV}`)
      }
    })
  } catch (err) {
    console.log(err)
  }
})()

module.exports = app
