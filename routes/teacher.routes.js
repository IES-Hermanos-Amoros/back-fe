const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher.controller");
const { protect } = require("../middlewares/jwt.mw");
const { restrictTo } = require("../middlewares/profile.mw");
const { isSelf } = require("../middlewares/isSelf.mw");

/**
 * @swagger
 * /teachers:
 *   get:
 *     tags: [Teachers]
 *     summary: Listar profesorado
 *     description: Solo ADMINISTRADOR/PROFESOR.
 *     responses:
 *       200:
 *         description: Lista de profesores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Teacher' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     tags: [Teachers]
 *     summary: Obtener un profesor por ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Profesor encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Teacher' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Teachers]
 *     summary: Actualizar un profesor
 *     description: Solo el propio profesor o un ADMINISTRADOR.
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Teacher' }
 *     responses:
 *       200: { description: Profesor actualizado }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

router.get("/", protect, restrictTo("ADMINISTRADOR", "PROFESOR"), teacherController.findAllTeachers);

router.get("/:id", protect, restrictTo("ADMINISTRADOR", "PROFESOR"), teacherController.findTeacherById);

//Logueado y ser admin o teacher propio (un teacher no puede modificar fichas de otros teacher)
router.patch("/:id", protect, isSelf(["ADMINISTRADOR"], "id"), teacherController.editTeacher);

module.exports = router;