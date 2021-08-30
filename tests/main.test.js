const sequelize = require('../src/server/db_init')

describe('DB connection', () => {
  it('should connect to the DB', async () => {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
  })
})
