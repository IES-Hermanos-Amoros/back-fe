const express = require('express');
const router = express.Router();

const dummyController = require('../controllers/dummy.controller');

/**
 * @swagger
 * /dummy:
 *   get:
 *     tags: [Dummy]
 *     summary: Listar datos de prueba
 *     security: []
 *     responses:
 *       200: { description: Lista de datos dummy }
 *   post:
 *     tags: [Dummy]
 *     summary: Crear un dato de prueba
 *     security: []
 *     responses:
 *       200: { description: Dato creado }
 *
 * /dummy/bulk-update:
 *   patch:
 *     tags: [Dummy]
 *     summary: Actualización masiva de datos de prueba
 *     security: []
 *     responses:
 *       200: { description: Datos actualizados }
 *
 * /dummy/login:
 *   post:
 *     tags: [Dummy]
 *     summary: Login ficticio (solo pruebas)
 *     description: Genera un JWT de prueba. Pensado únicamente para desarrollo; no debe exponerse en producción.
 *     security: []
 *     responses:
 *       200: { description: Token de prueba generado }
 *
 * /dummy/{id}:
 *   get:
 *     tags: [Dummy]
 *     summary: Obtener un dato de prueba por ID
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Dato encontrado }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   put:
 *     tags: [Dummy]
 *     summary: Editar un dato de prueba
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Dato actualizado }
 *   delete:
 *     tags: [Dummy]
 *     summary: Eliminar un dato de prueba
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Dato eliminado }
 */

// =======================
// GET
// =======================

// Obtener todos los dummies
router.get('/', dummyController.getAllDummies);

// Obtener dummy por ID
router.get('/:id', dummyController.getDummyById);


// =======================
// POST
// =======================

// Crear nuevo dummy
router.post('/', dummyController.createDummy);

// =======================
// PUT
// =======================
router.patch('/bulk-update', dummyController.bulkUpdateDummies); // NUEVO ENDPOINT PARA ACTUALIZACIÓN MASIVA

// Editar dummy por ID
router.put('/:id', dummyController.editDummyById);
// =======================
// DELETE
// =======================

// Eliminar dummy por ID
router.delete('/:id', dummyController.deleteDummyById);


//Dummy login ficticio /dummy/login
router.post('/login', dummyController.loginDummy)


module.exports = router;
