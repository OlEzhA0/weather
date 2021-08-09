const { DataTypes } = require('sequelize')

const sequelize = require('../db_init')

const Cities = sequelize.define('cities', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  cities: { type: DataTypes.ARRAY(DataTypes.STRING) },
})

module.exports = { Cities }
