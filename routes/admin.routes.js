const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { protect } = require("../middlewares/jwt.mw");
const { restrictTo } = require("../middlewares/profile.mw");
const { isSelf } = require("../middlewares/isSelf.mw");

/**
 * @swagger
 * /administrators:
 *   get:
 *     tags: [Administrators]
 *     summary: Listar administradores
 *     description: Solo ADMINISTRADOR.
 *     responses:
 *       200: { description: Lista de administradores }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

/**
 * @swagger
 * /administrators/{id}:
 *   get:
 *     tags: [Administrators]
 *     summary: Obtener un administrador por ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Administrador encontrado }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Administrators]
 *     summary: Actualizar un administrador
 *     description: Solo el propio administrador.
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Administrador actualizado }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

router.get("/", protect, restrictTo("ADMINISTRADOR"), adminController.getAllAdmins);

router.get("/:id", protect, restrictTo("ADMINISTRADOR"), adminController.getAdminById);

//Logueado y ser el admin propio (un admin no puede modificar fichas de otros admin)
router.patch("/:id", protect, isSelf([], "id"), adminController.editAdminById);

module.exports = router;