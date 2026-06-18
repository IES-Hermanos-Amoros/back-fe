const express = require("express")
const router = express.Router()

const fctController = require("../controllers/fct.controller")

const { protect } = require("../middlewares/jwt.mw")
const { restrictTo } = require("../middlewares/profile.mw")
const { isFctOwner } = require("../middlewares/isFctOwner.mw");

/**
 * @swagger
 * /fct:
 *   get:
 *     tags: [FCT]
 *     summary: Listar FCTs
 *     description: Devuelve los convenios de Formación en Empresa visibles para el usuario.
 *     responses:
 *       200:
 *         description: Lista de FCTs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/FCT' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */

/**
 * @swagger
 * /fct/{id}:
 *   get:
 *     tags: [FCT]
 *     summary: Obtener una FCT por ID
 *     description: El alumno/empresa solo puede ver sus propias FCTs; ADMINISTRADOR/PROFESOR ven todas.
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: FCT encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FCT' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [FCT]
 *     summary: Actualizar datos FCTM de una FCT
 *     description: Solo ADMINISTRADOR/PROFESOR. Los datos SAO son de solo lectura.
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/FCT' }
 *     responses:
 *       200: { description: FCT actualizada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

// GET -> Mostrar listado de FCTs
router.get(
  "/",
  protect,
  //restrictTo("ADMINISTRADOR","PROFESOR"), --> De cara al sprint 5 
  fctController.findAllFcts
)

// GET -> Mostrar FCT por ID
router.get(
  "/:id",
  protect,
  isFctOwner(["ADMINISTRADOR", "PROFESOR"]),
  fctController.findFctById
);

// PATCH -> Actualizar FCT
router.patch(
  "/:id",
  protect,
  restrictTo("ADMINISTRADOR","PROFESOR"),
  fctController.editFct
)

module.exports = router