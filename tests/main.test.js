const sequelize = require('../src/server/db_init')

describe('Should connect to test DB', () => {
  it('should connect to the DB', async () => {
    await sequelize.authenticate()
    await sequelize.sync()
  })
})
