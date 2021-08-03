const path = require('path')

const APIError = require('../errors/APIError')

const errorHandler = (err, req, res, _) => {
  if (req.path.startsWith('/api')) {
    if (err instanceof APIError) {
      return res.status(err.status).json({ message: err.message })
    }

    return res.status(501).json({ message: 'Something went wrong!' })
  }

  const resolvedPath = path.resolve(__dirname, '../../src', 'index.html')

  res.sendFile(resolvedPath)
}

module.exports = errorHandler
