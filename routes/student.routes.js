const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { protect } = require('../middlewares/jwt.mw');
const { restrictTo } = require('../middlewares/profile.mw');
const { isSelf } = require('../middlewares/isSelf.mw');

/**
 * @swagger
 * /students:
 *   get:
 *     tags: [Students]
 *     summary: Listar alumnado
 *     description: Devuelve todos los alumnos. Accesible a ADMINISTRADOR, PROFESOR y EMPRESA.
 *     responses:
 *       200:
 *         description: Lista de alumnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Student' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

/**
 * @swagger
 * /students/bulk-update:
 *   patch:
 *     tags: [Students]
 *     summary: Asignar aptitudes a varios alumnos
 *     description: Añade un conjunto de aptitudes a todos los alumnos indicados. Solo ADMINISTRADOR/PROFESOR.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids, skills]
 *             properties:
 *               ids: { type: array, items: { type: string }, description: IDs de los alumnos }
 *               skills: { type: array, items: { type: string }, description: IDs de las aptitudes }
 *     responses:
 *       200: { description: Alumnos actualizados }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Obtener un alumno por ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Alumno encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Student' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Students]
 *     summary: Actualizar datos FCTM de un alumno
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Student' }
 *     responses:
 *       200: { description: Alumno actualizado }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

router.get('/', protect, restrictTo("ADMINISTRADOR", "PROFESOR", "EMPRESA"), studentController.getAllStudents);

// Actualización masiva de aptitudes
router.patch('/bulk-update', protect, restrictTo("ADMINISTRADOR", "PROFESOR"), studentController.bulkUpdateSkills);

//Logueado y ser admin, teacher, company o student propio (un student no puede acceder a los detalles de otros students)
router.get('/:id', protect, isSelf(["ADMINISTRADOR", "PROFESOR", "EMPRESA"], "id"), studentController.getStudentById);

//Logueado y ser admin, teacher o student propio (un student no puede modfiicar los detalles de otros students) (una empresa tampoco podrá modificar el perfil de un estudiante)
router.patch('/:id', protect, isSelf(["ADMINISTRADOR", "PROFESOR"], "id"), studentController.updateStudentFctm);

module.exports = router;