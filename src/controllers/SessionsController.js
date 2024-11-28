// Importando a conexão com o banco de dados
const knex = require('../database/knex')

const AppError = require('../utils/AppError')

// Usando a função 'compare' do bcrypt para comparar senha criptografada
const { compare } = require('bcryptjs')
const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken')

// Controller que irá implementar autenticação de usuários
class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

    const user = await knex('users').where({ email }).first()

    if (!user) {
      throw new AppError('E-mail e/ou senha incorreta', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('E-mail e/ou senha incorreta', 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })
    
    return response.json({ user, token })
  }
}

module.exports = SessionsController