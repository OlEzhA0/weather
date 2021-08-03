require('dotenv').config()

const { Sequelize } = require('sequelize')

module.exports = process.env.NODE_ENV === 'development' 
  ? new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      dialect: process.env.DB_DIALECT,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    }
  ) : new Sequelize(
    process.env.DATABASE_URL,
    {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
      }
    }
  )