const { DataTypes } = require('sequelize')

const sequelize = require('../db_init')

const Token = sequelize.define('token', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  token: { type: DataTypes.STRING },
})

module.exports = { Token }
