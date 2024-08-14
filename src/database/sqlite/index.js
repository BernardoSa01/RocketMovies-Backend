// Importando o sqlite
const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')

const path = require('path')

// Função para criação do arquivo do banco de dados

async function sqliteConnection() {
  const database = await sqlite.open({
    // Propriedade para informar onde o database ficará salvo
    filename: path.resolve(__dirname, '..', 'database.db'),
    driver: sqlite3.Database
  })

  return database
}

module.exports = sqliteConnection