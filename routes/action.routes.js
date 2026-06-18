const actionController = require("../controllers/action.controller")
const { upload, validateAndScanFiles } = require("../middlewares/upload.middleware")
const express = require("express")
const router = express.Router()

const { protect } = require("../middlewares/jwt.mw")
const { restrictTo } = require("../middlewares/profile.mw")

/**
 * @swagger
 * /actions:
 *   get:
 *     tags: [Actions]
 *     summary: Listar acciones de seguimiento
 *     description: Solo ADMINISTRADOR/PROFESOR.
 *     responses:
 *       200:
 *         description: Lista de acciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Action' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   post:
 *     tags: [Actions]
 *     summary: Crear una acción (con archivos adjuntos opcionales)
 *     description: Solo ADMINISTRADOR/PROFESOR. Permite adjuntar hasta 10 archivos.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               FCTM_action_title: { type: string }
 *               FCTM_action_type: { type: string }
 *               FCTM_action_notes: { type: string }
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       200: { description: Acción creada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *
 * /actions/{id}:
 *   get:
 *     tags: [Actions]
 *     summary: Obtener una acción por ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Acción encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Action' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Actions]
 *     summary: Actualizar una acción
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/Action' }
 *     responses:
 *       200: { description: Acción actualizada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   delete:
 *     tags: [Actions]
 *     summary: Eliminar una acción
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Acción eliminada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

// Mostrar listado de acciones
router.get(
  "/",
  protect,
  restrictTo("ADMINISTRADOR","PROFESOR"),
  actionController.getAllActions
)

//crear una accion
router.post("/",protect,restrictTo("ADMINISTRADOR","PROFESOR"), upload.array("files",10), validateAndScanFiles, actionController.newAction)

// Mostrar acción por ID
router.get(
  "/:id",
  protect,
  restrictTo("ADMINISTRADOR","PROFESOR"),
  actionController.getActionById
)

// Actualizar una acción
router.patch(
  "/:id",
  protect,
  restrictTo("ADMINISTRADOR","PROFESOR"),
  upload.array("files",10), validateAndScanFiles,
  actionController.editActionById
)

// Borrar una acción
router.delete(
  "/:id",
  protect,
  restrictTo("ADMINISTRADOR","PROFESOR"),
  actionController.deleteActionById
)

module.exports = router