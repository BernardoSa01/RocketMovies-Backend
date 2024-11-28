// Função 'hash' irá gerar a criptografia de senhas
const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')

const sqliteConnection = require('../database/sqlite')

class UsersController  {
  // Função assíncrona para criação de usuários
  async create(request, response) {
    const { name, email, password } = request.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])

    // Se o e-mail já estiver em uso, lance um throw com a mensagem de erro
    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }

    // Criptografando a senha do usuário. Fator de complexidade 8
    const hashedPassword = await hash(password, 8)

    // Insira nome, email e senha dentro de 'users'
    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [ name, email, hashedPassword ]
    )

    return response.status(201).json()
  }

  // Função assíncrona para atualização de usuários
  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const user_id = request.user.id

    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [user_id])

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])

    /* Criando uma condicional para que se o usuário atualize o e-mail para um endereço já cadastrado
    no banco de dados, seja lançado o erro informando que o referido e-mail já está sendo utilizado
    por outro usuário */
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    // Se a senha antiga não for informada, lance o erro informativo
    if (password && !old_password) {
      throw new AppError('Você precisa informar a senha antiga para definir a nova senha')
    }

    // Criando condicional para verificar a validade da senha antiga
    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere')
      }

      user.password = await hash(password, 8)
    }

    // Executando o 'update'
    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    )

    return response.json()
  }
}

module.exports = UsersController