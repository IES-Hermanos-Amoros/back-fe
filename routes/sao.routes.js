const saoController = require("../controllers/sao.controller")
const rutasProtegidas = require("../middlewares/rutasprotegidas.mw")
const jwtMW = require("../middlewares/jwt.mw")
const express = require("express")
const router = express.Router()

/**
 * @swagger
 * /sao/login:
 *   post:
 *     tags: [SAO]
 *     summary: Iniciar sesión en SAO FCT
 *     description: Autentica contra SAO FCT y devuelve un `SAOtoken` usado por los procesos de sincronización.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200: { description: Login SAO correcto (devuelve SAOtoken) }
 *       404: { description: Credenciales SAO incorrectas }
 *
 * /sao/companies_sinc:
 *   post:
 *     tags: [SAO]
 *     summary: Obtener empresas desde SAO
 *     description: Descarga las empresas desde SAO (paso previo a aplicar cambios). El progreso se emite por Socket.IO.
 *     responses:
 *       200: { description: Empresas obtenidas de SAO }
 *
 * /sao/companies:
 *   post:
 *     tags: [SAO]
 *     summary: Insertar/actualizar empresas en la BD
 *     responses:
 *       200: { description: Empresas sincronizadas en MongoDB }
 *
 * /sao/teachers_sinc:
 *   post:
 *     tags: [SAO]
 *     summary: Obtener profesorado desde SAO
 *     responses:
 *       200: { description: Profesorado obtenido de SAO }
 *
 * /sao/teachers:
 *   post:
 *     tags: [SAO]
 *     summary: Insertar/actualizar profesorado en la BD
 *     responses:
 *       200: { description: Profesorado sincronizado }
 *
 * /sao/students_sinc:
 *   post:
 *     tags: [SAO]
 *     summary: Obtener alumnado desde SAO
 *     responses:
 *       200: { description: Alumnado obtenido de SAO }
 *
 * /sao/students:
 *   post:
 *     tags: [SAO]
 *     summary: Insertar/actualizar alumnado en la BD
 *     responses:
 *       200: { description: Alumnado sincronizado }
 *
 * /sao/fcts_sinc:
 *   post:
 *     tags: [SAO]
 *     summary: Obtener FCTs desde SAO
 *     responses:
 *       200: { description: FCTs obtenidas de SAO }
 *
 * /sao/fcts:
 *   post:
 *     tags: [SAO]
 *     summary: Insertar/actualizar FCTs en la BD
 *     responses:
 *       200: { description: FCTs sincronizadas }
 */

module.exports = (io) => {
    router.get("/login",saoController.showLogin)    
    router.post("/login",saoController.login)

    //TEMPORAL
    //router.post("/companies_sinc",jwtMW.authenticate,rutasProtegidas.requireProfesor,saoController.companies(io))
    router.post("/companies_sinc",saoController.companies(io))
    //router.post("/companies",jwtMW.authenticate,rutasProtegidas.requireProfesor,saoController.companiesInsertUpdateDB)
    router.post("/companies",saoController.companiesInsertUpdateDB)

    //TEMPORAL
    //router.post("/teachers",jwtMW.authenticate,rutasProtegidas.requireAdministrador,saoController.teachers(io))
    //router.post("/teachers",jwtMW.authenticate,rutasProtegidas.requireAdministrador,saoController.teachersInsertUpdateDB)
    router.post("/teachers_sinc",saoController.teachers(io))
    router.post("/teachers",saoController.teachersInsertUpdateDB)

    //TEMPORAL
    //router.post("/students_sinc",jwtMW.authenticate,rutasProtegidas.requireProfesor,saoController.students(io))
    //router.post("/students",jwtMW.authenticate,rutasProtegidas.requireProfesor,saoController.studentsInsertUpdateDB)
    router.post("/students_sinc",saoController.students(io))
    router.post("/students",saoController.studentsInsertUpdateDB)


    //PENDIENTE hacer que los profesores sincronicen sólo SUS FCTS
    //router.get("/fctsTeacher",jwtMW.authenticate,rutasProtegidas.requireProfesor,saoController.fct(io))
    //TEMPORAL
    //router.get("/fcts_sinc",jwtMW.authenticate,rutasProtegidas.requireAdministrador,saoController.fctAll(io))
    //router.post("/fcts",jwtMW.authenticate,rutasProtegidas.requireAdministrador,saoController.fctsInsertUpdateDB)
    router.post("/fcts_sinc",saoController.fct(io))
    router.post("/fcts",saoController.fctsInsertUpdateDB)


    return router
}

//module.exports = router