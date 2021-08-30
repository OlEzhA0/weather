require('dotenv').config()

const { Sequelize } = require('sequelize')

const generateSequelize = () => {
  const env = process.env.NODE_ENV

  if (env === 'test') {
    return new Sequelize(
      'test_weather',
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        port: process.env.POSTGRES_PORT,
        host: process.env.POSTGRES_HOST,
        dialect: 'postgres',
        protocol: 'postgres',
      }
    )
  }

  if (env === 'development') {
    return new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
      }
    )
  }

  return new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  })
}

module.exports = generateSequelize()
