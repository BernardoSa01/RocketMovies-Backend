const { Router } = require("express")

const TagsController = require('../controllers/TagsController')

const tagsRoutes = Router()

const tagsController = new TagsController()

// Criando rotas para as funcionalidades
tagsRoutes.get("/:user_id", tagsController.index)



module.exports = tagsRoutes