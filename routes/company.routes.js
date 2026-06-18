const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");
const { protect } = require("../middlewares/jwt.mw");
const { restrictTo } = require("../middlewares/profile.mw");
const { isSelf } = require("../middlewares/isSelf.mw");

/**
 * @swagger
 * /companies:
 *   get:
 *     tags: [Companies]
 *     summary: Listar empresas
 *     description: Devuelve todas las empresas. Accesible a ADMINISTRADOR, PROFESOR y ALUMNO.
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Company' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

/**
 * @swagger
 * /companies/bulk-update-skills:
 *   patch:
 *     tags: [Companies]
 *     summary: Asignar aptitudes a varias empresas
 *     description: Añade un conjunto de aptitudes a todas las empresas indicadas. Solo ADMINISTRADOR/PROFESOR.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids, skills]
 *             properties:
 *               ids: { type: array, items: { type: string }, description: IDs de las empresas }
 *               skills: { type: array, items: { type: string }, description: IDs de las aptitudes }
 *     responses:
 *       200: { description: Empresas actualizadas }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

/**
 * @swagger
 * /companies/bulk-update-categories:
 *   patch:
 *     tags: [Companies]
 *     summary: Asignar familias profesionales a varias empresas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids, categoryIds]
 *             properties:
 *               ids: { type: array, items: { type: string } }
 *               categoryIds: { type: array, items: { type: string } }
 *     responses:
 *       200: { description: Empresas actualizadas }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Obtener una empresa por ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Company' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Companies]
 *     summary: Actualizar datos FCTM de una empresa
 *     description: Solo ADMINISTRADOR/PROFESOR. Los datos SAO son de solo lectura.
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Company' }
 *     responses:
 *       200: { description: Empresa actualizada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

router.get("/", protect, restrictTo("ADMINISTRADOR", "PROFESOR", "ALUMNO"), companyController.getAllCompanies);

// Actualización masiva de aptitudes para empresas
router.patch('/bulk-update-skills', protect, restrictTo("ADMINISTRADOR", "PROFESOR"), companyController.bulkUpdateSkills);
router.patch('/bulk-update-categories', protect, restrictTo("ADMINISTRADOR", "PROFESOR"), companyController.bulkUpdateCategories);

//Logueado y ser admin, teacher, student o company propio (una empresa no debe poder acceder a los detalles de otras empresas)
router.get("/:id", protect, isSelf(["ADMINISTRADOR", "PROFESOR", "ALUMNO"], "id"), companyController.getCompanyById);

//Logueado y ser admin, teacher o company propio (una empresa no debe poder modificar los detalles de otras empresas) (un alumno tampoco podrá modificar nada de una empresa, sólo ver los detalles)
router.patch("/:id", protect, isSelf(["ADMINISTRADOR", "PROFESOR"], "id"), companyController.editCompanyById);

module.exports = router;