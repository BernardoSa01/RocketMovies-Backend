const { Router } = require("express")

const TagsController = require('../controllers/TagsController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const tagsRoutes = Router()

const tagsController = new TagsController()

// Criando rotas para as funcionalidades
tagsRoutes.get("/", ensureAuthenticated, tagsController.index)



module.exports = tagsRoutes