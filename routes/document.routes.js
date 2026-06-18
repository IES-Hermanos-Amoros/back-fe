const documentController = require('../controllers/document.controller')
const {
  upload,
  validateAndScanFiles,
} = require('../middlewares/upload.middleware')
const express = require('express')
const router = express.Router()
const jwt = require('../middlewares/jwt.mw.js')
const profile = require('../middlewares/profile.mw.js')
const isOwnerMW = require('../middlewares/isOwner.mw.js')
const DocumentManager = require('../models/documentManager.model.js')
const authorizeDocumentAccess = require('../middlewares/authorizeDocument.mw.js')

/**
 * @swagger
 * /documents:
 *   get:
 *     tags: [Documents]
 *     summary: Listar documentos
 *     description: Devuelve los documentos visibles para el perfil del usuario.
 *     responses:
 *       200:
 *         description: Lista de documentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Document' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Documents]
 *     summary: Crear un documento (metadatos)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Document' }
 *     responses:
 *       200: { description: Documento creado }
 *
 * /documents/upload:
 *   post:
 *     tags: [Documents]
 *     summary: Subir archivos
 *     description: Sube hasta 10 archivos (PDF/imagen/Word, máx 5MB). Se validan tipo MIME y antivirus.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *               name: { type: string }
 *               description: { type: string }
 *               type: { type: string }
 *               visible_to_profiles: { type: string, description: "Perfiles separados por comas" }
 *     responses:
 *       200: { description: Documentos subidos }
 *       400: { description: No se han subido archivos o son inválidos }
 *
 * /documents/{id}:
 *   get:
 *     tags: [Documents]
 *     summary: Obtener un documento por ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Documento encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Document' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Documents]
 *     summary: Actualizar un documento
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Document' }
 *     responses:
 *       200: { description: Documento actualizado }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   delete:
 *     tags: [Documents]
 *     summary: Eliminar un documento
 *     description: Solo ADMINISTRADOR, PROFESOR o la EMPRESA propietaria.
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Documento eliminado }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *
 * /documents/{id}/download:
 *   get:
 *     tags: [Documents]
 *     summary: Descargar el archivo físico de un documento
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Archivo
 *         content:
 *           application/octet-stream:
 *             schema: { type: string, format: binary }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

//Mostrar VISTA EJS index.ejs con listado de Documentos
router.get(
  '/',
  jwt.protect,
  //profile.restrictTo('ADMINISTRADOR', 'PROFESOR'), //ERROR. El filtrado se realiza en el service, no aquí. Aquí se deja pasar a todos los perfiles, y el service se encarga de filtrar según el perfil del usuario.
  documentController.getAllDocuments
)

//Mostrar vista para crear un documento
//router.get("/new",documentController.showNewComment) "VISTA EJS"
router.post(
  '/upload',
  jwt.protect,
  upload.array('files', 10),
  validateAndScanFiles,
  documentController.uploadDocuments
)

//POST - Crear Documento
router.post('/', jwt.protect, documentController.newDocument)

//Mostrar Documentos por ID
router.get(
  '/:id',
  jwt.protect,
  authorizeDocumentAccess('read'),
  documentController.getDocumentById
)

// Descargar archivo físico del documento
router.get(
  '/:id/download',
  jwt.protect,
  authorizeDocumentAccess('read'),
  documentController.downloadDocument
)

//Mostrar vista para editar un Documento
//router.get("/:id/edit",documentController.showEditComment) "VISTA EJS"

//PATCH - Updatear un Documento
router.patch(
  '/:id',
  jwt.protect,
  authorizeDocumentAccess('update'),
  documentController.editDocumentById
)

//DELETE - Borrar un Documento
//Logueado y ser admin, teacher o el alumno que ha creado el documento (owner)
router.delete(
  '/:id',
  jwt.protect,
  isOwnerMW.isOwner(DocumentManager, 'FCTM_document_created_by', [
    'ADMINISTRADOR',
    'PROFESOR',
    'EMPRESA'
  ]),
  //authorizeDocumentAccess('delete'),
  documentController.deleteDocumentById
)

module.exports = router
