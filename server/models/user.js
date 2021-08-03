const { DataTypes } = require('sequelize')

const sequelize = require('../db_init')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
})

module.exports = { User }
