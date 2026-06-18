const jobOfferController = require("../controllers/jobOffer.controller")
const express = require("express")
const router = express.Router()
const { protect } = require("../middlewares/jwt.mw")
const { restrictTo } = require("../middlewares/profile.mw")
const { isOwnerArray } = require("../middlewares/isOwnerArray.mw")
const UserManager = require("../models/userManager.model")

/**
 * @swagger
 * /joboffers:
 *   get:
 *     tags: [Job Offers]
 *     summary: Listar ofertas de trabajo
 *     description: Accesible a ADMINISTRADOR, PROFESOR y ALUMNO.
 *     responses:
 *       200:
 *         description: Lista de ofertas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/JobOffer' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   post:
 *     tags: [Job Offers]
 *     summary: Publicar una oferta de trabajo
 *     description: Accesible a ADMINISTRADOR, PROFESOR y EMPRESA.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/JobOffer' }
 *     responses:
 *       200: { description: Oferta creada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *
 * /joboffers/{id}:
 *   get:
 *     tags: [Job Offers]
 *     summary: Obtener una oferta por ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Oferta encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/JobOffer' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Job Offers]
 *     summary: Actualizar una oferta
 *     description: Solo ADMINISTRADOR, PROFESOR o la empresa propietaria.
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/JobOffer' }
 *     responses:
 *       200: { description: Oferta actualizada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   delete:
 *     tags: [Job Offers]
 *     summary: Eliminar una oferta
 *     description: Solo ADMINISTRADOR, PROFESOR o la empresa propietaria.
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: Oferta eliminada }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */

//Mostrar el listado de todos los job offers
router.get("/",protect,restrictTo("ADMINISTRADOR","PROFESOR","ALUMNO"),jobOfferController.findAllJobOffers)

//Crear un job offer
router.post("/",protect,restrictTo("ADMINISTRADOR","PROFESOR","EMPRESA"),jobOfferController.postJobOffer)

//Mostrar un job offer conseguido por id
//Logueado y ser admin, teacher, alumno o la empresa que ha creado la oferta de trabajo (owner)
router.get("/:id",
    protect,
    isOwnerArray(UserManager, "FCTM_job_offers", ["ADMINISTRADOR", "PROFESOR", "ALUMNO"],
    "id", 
    false),
    jobOfferController.findJobOfferById)

//Updatear un job offer
//Logueado y ser admin, teacher o la empresa que ha creado la oferta de trabajo (owner)
router.patch("/:id",
    protect,
     isOwnerArray(UserManager, "FCTM_job_offers", ["ADMINISTRADOR", "PROFESOR"],
    "id", 
    false),
    jobOfferController.editJobOffer)

//Borrar un job offer
//Logueado y ser admin, teacher o la empresa que ha creado la oferta de trabajo (owner)
router.delete("/:id",
    protect,
     isOwnerArray(UserManager, "FCTM_job_offers", ["ADMINISTRADOR", "PROFESOR"],
    "id", 
    false),
    jobOfferController.deleteJobOffer)

//Exportar rutas
module.exports = router