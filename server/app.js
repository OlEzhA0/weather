require('dotenv').config()
const express = require('express')
const app = express()
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 3005

const config = require('../webpack.config')
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

app.get('*', (req, res) => {
  const resolvedPath = path.resolve(__dirname, '../dist', 'index.html')

  res.sendFile(resolvedPath)
})

app.use(errorHandler)

// INIT
;(async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    app.listen(port, () => console.log(`Listening on port ${port}`))
  } catch (err) {
    console.log(err)
  }
})()
