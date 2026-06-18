const categoryController = require("../controllers/category.controller");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Listar familias profesionales
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de familias profesionales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Category' }
 *
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Obtener una familia profesional por ID
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Familia encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Category' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

// Obtener todas las categorías
router.get("/", categoryController.getAllCategories);

// Obtener una categoría específica por ID
router.get("/:id", categoryController.getCategoryById);

module.exports = router;