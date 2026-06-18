const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

/**
 * @route   GET /stats
 * @desc    Obtener todas las estadísticas consolidadas para el dashboard
 * @access  Privado (Profesorado / Administradores)
 */

/**
 * @swagger
 * /stats:
 *   get:
 *     tags: [Stats]
 *     summary: Estadísticas del panel
 *     description: Devuelve los datos consolidados para el dashboard (convenios por curso, top tecnologías, alumnado por localidad, etc.).
 *     responses:
 *       200:
 *         description: Objeto con las estadísticas del panel
 *         content:
 *           application/json:
 *             schema: { type: object }
 */
router.get('/', statsController.getDashboardStats);

module.exports = router;