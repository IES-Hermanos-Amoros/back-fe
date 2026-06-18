const reviewController = require("../controllers/review.controller");
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/jwt.mw.js");
const { restrictTo } = require("../middlewares/profile.mw.js");
const { isOwner } = require("../middlewares/isOwner.mw.js");
const ReviewManager = require("../models/reviewManager.model.js");
const { ro } = require("date-fns/locale");

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Listar reseñas verificadas
 *     responses:
 *       200:
 *         description: Lista de reseñas verificadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Review' }
 *   post:
 *     tags: [Reviews]
 *     summary: Crear una reseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Review' }
 *     responses:
 *       200: { description: Reseña creada }
 *
 * /reviews/unverified:
 *   get:
 *     tags: [Reviews]
 *     summary: Listar reseñas pendientes de validar
 *     description: Solo ADMINISTRADOR/PROFESOR.
 *     responses:
 *       200: { description: Lista de reseñas no verificadas }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *
 * /reviews/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Listado global de reseñas
 *     responses:
 *       200: { description: Listado global }
 *
 * /reviews/bulk-update:
 *   patch:
 *     tags: [Reviews]
 *     summary: Validar varias reseñas a la vez
 *     description: Solo ADMINISTRADOR/PROFESOR.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids: { type: array, items: { type: string } }
 *     responses:
 *       200: { description: Reseñas validadas }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *
 * /reviews/all-delete:
 *   delete:
 *     tags: [Reviews]
 *     summary: Eliminar todas las reseñas
 *     description: Solo ADMINISTRADOR/PROFESOR.
 *     responses:
 *       200: { description: Reseñas eliminadas }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *
 * /reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Obtener una reseña por ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Reseña encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Review' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Reviews]
 *     summary: Actualizar una reseña
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Review' }
 *     responses:
 *       200: { description: Reseña actualizada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   delete:
 *     tags: [Reviews]
 *     summary: Eliminar una reseña
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Reseña eliminada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

router.get(
  "/",
  protect,
  restrictTo("ADMINISTRADOR", "PROFESOR", "ALUMNO"),
  reviewController.getAllVerifiedReviews,
);

router.get(
  "/unverified",
  protect,
  restrictTo("ADMINISTRADOR","PROFESOR"),
  reviewController.getAllNotVerifiedReviews,
);

router.get(
  "/reviews",
  protect,
  restrictTo("ADMINISTRADOR", "PROFESOR","ALUMNO"),
  reviewController.getGlobalReviewsList
);

router.patch(
  "/bulk-update",
  protect,
  restrictTo("ADMINISTRADOR", "PROFESOR"),
  reviewController.bulkValidateReviews
)

router.delete(
  "/all-delete",
  protect,
  restrictTo("ADMINISTRADOR", "PROFESOR"),
  reviewController.allDeleteReviews
)

//Logueado y ser admin, teacher o student (el que creó la reseña... el owner)
router.get(
  "/:id",
  protect,
  isOwner(ReviewManager, "FCTM_user_id", ["ADMINISTRADOR", "PROFESOR", "ALUMNO"]),
  reviewController.getReviewById,
);

router.post(
  "/",
  protect,
  restrictTo("ADMINISTRADOR", "PROFESOR", "ALUMNO"),
  reviewController.createReview,
);

//Logueado y ser admin, teacher o student (el que creó la reseña... el owner)
router.patch(
  "/:id",
  protect,
  isOwner(ReviewManager, "FCTM_user_id", ["ADMINISTRADOR", "PROFESOR"]),
  reviewController.editReviewById,
);

//Logueado y ser admin, teacher o student (el que creó la reseña... el owner)
router.delete(
  "/:id",
  protect,
  isOwner(ReviewManager, "FCTM_user_id", ["ADMINISTRADOR", "PROFESOR"]),
  reviewController.deleteReviewById,
);

module.exports = router;
