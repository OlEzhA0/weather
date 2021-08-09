const { Cities } = require('./cities')
const { User } = require('./user')
const { Token } = require('./token')

User.hasOne(Cities)
User.hasOne(Token)

module.exports = {
  User,
  Cities,
  Token,
}
