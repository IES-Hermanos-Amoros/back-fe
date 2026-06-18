const skillController = require("../controllers/skill.controller");
const { protect } = require("../middlewares/jwt.mw.js");
const { restrictTo } = require("../middlewares/profile.mw.js");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /skills:
 *   get:
 *     tags: [Skills]
 *     summary: Listar aptitudes verificadas
 *     responses:
 *       200:
 *         description: Lista de aptitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Skill' }
 *   post:
 *     tags: [Skills]
 *     summary: Crear una aptitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Skill' }
 *     responses:
 *       200: { description: Aptitud creada }
 *
 * /skills/search:
 *   get:
 *     tags: [Skills]
 *     summary: Buscar aptitudes por nombre
 *     parameters:
 *       - name: q
 *         in: query
 *         description: Texto a buscar en el nombre de la aptitud
 *         schema: { type: string }
 *     responses:
 *       200: { description: Resultados de la búsqueda }
 *
 * /skills/unverified:
 *   get:
 *     tags: [Skills]
 *     summary: Listar aptitudes sin verificar
 *     description: Solo ADMINISTRADOR/PROFESOR.
 *     responses:
 *       200: { description: Lista de aptitudes no verificadas }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *
 * /skills/bulk-verify:
 *   patch:
 *     tags: [Skills]
 *     summary: Verificar varias aptitudes
 *     description: Solo ADMINISTRADOR/PROFESOR.
 *     responses:
 *       200: { description: Aptitudes verificadas }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *
 * /skills/bulk-delete:
 *   delete:
 *     tags: [Skills]
 *     summary: Eliminar varias aptitudes
 *     description: Solo ADMINISTRADOR/PROFESOR.
 *     responses:
 *       200: { description: Aptitudes eliminadas }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *
 * /skills/{id}:
 *   get:
 *     tags: [Skills]
 *     summary: Obtener una aptitud por ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Aptitud encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Skill' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Skills]
 *     summary: Editar una aptitud
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Skill' }
 *     responses:
 *       200: { description: Aptitud actualizada }
 *   delete:
 *     tags: [Skills]
 *     summary: Eliminar una aptitud
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Aptitud eliminada }
 */

// Ruta para el buscador (Debe ir antes de /:id para evitar conflictos)
// Ejemplo: /api/skills/search?q=javascript
router.get("/search", skillController.searchSkills);

// Obtener todas las aptitudes (Filtradas por verificadas en el servicio)
router.get("/", skillController.getAllVerifiedSkills);
// Obtener todas las aptitudes no verificadas (para admin)
router.get(
  "/unverified",
  protect,
  restrictTo("ADMINISTRADOR", "PROFESOR"),
  skillController.getAllNotVerifiedSkills,
);

// Actualización masiva de aptitudes
router.patch(
  "/bulk-verify",
  protect,
  restrictTo("ADMINISTRADOR", "PROFESOR"),
  skillController.bulkVerifySkills,
);

// Eliminación masiva de aptitudes
router.delete(
  "/bulk-delete",
  protect,
  restrictTo("ADMINISTRADOR", "PROFESOR"),
  skillController.bulkDeleteSkills,
);

// Obtener una aptitud específica por ID
router.get("/:id", skillController.getSkillById);

// Crear una nueva aptitud
router.post("/", skillController.createSkill);

router.post("/ensure", protect, skillController.ensureSkills);

// Editar una aptitud (Cambiado a patch para ser fiel a tu ejemplo)
router.patch("/:id", skillController.editSkillById);

// Eliminar una aptitud
router.delete("/:id", skillController.deleteSkillById);

module.exports = router;
