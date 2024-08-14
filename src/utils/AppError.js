class AppError {
  message
  statusCode

  // Caso o status code não seja informado, o padrão será o '400'
  constructor(message, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}

module.exports = AppError
