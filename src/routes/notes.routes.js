const { Router } = require("express")

const NotesController = require('../controllers/NotesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const notesRoutes = Router()

const notesController = new NotesController()

// Middleware de autenticação para todas as rotas
notesRoutes.use(ensureAuthenticated)

// Criando rotas para as funcionalidades
notesRoutes.post("/", notesController.create)
notesRoutes.get("/:id", notesController.show)
notesRoutes.delete("/:id", notesController.delete)
notesRoutes.get("/", notesController.index)


module.exports = notesRoutes