const express = require("express")
const router = express.Router()
const enumController = require("../controllers/enum.controller")

/**
 * @swagger
 * /enums:
 *   get:
 *     tags: [Enums]
 *     summary: Listar todas las enumeraciones
 *     security: []
 *     responses:
 *       200: { description: Conjunto de enumeraciones del sistema }
 *
 * /enums/{name}:
 *   get:
 *     tags: [Enums]
 *     summary: Obtener una enumeración por nombre
 *     security: []
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: Nombre de la enumeración
 *         schema: { type: string }
 *     responses:
 *       200: { description: Valores de la enumeración }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

//1º ruta - getAll
router.get('/', enumController.getAll)

//2º ruta - getEnumByName
router.get('/:name', enumController.getEnumByName)

module.exports = router