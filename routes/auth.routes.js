//LOGINSAOFCTM INI
const express = require("express");
const authController = require("../controllers/auth.controller");
const {protectSAO, protect} = require("../middlewares/jwt.mw");

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     description: Valida usuario y contraseña y, si son correctos, entrega el JWT en una cookie httpOnly `jwt`.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login correcto. Devuelve los datos del usuario y fija la cookie `jwt`.
 *       400:
 *         description: Faltan campos obligatorios
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/register-from-sao:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar usuario desde SAO
 *     description: Crea en MongoDB un usuario a partir de sus datos de SAO si aún no existe. Requiere `SAOtoken`.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario creado (estado FIRST_LOGIN)
 *       400:
 *         description: Datos SAO inválidos o el usuario ya existe
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/complete-first-login:
 *   post:
 *     tags: [Auth]
 *     summary: Completar el primer acceso
 *     description: Establece la contraseña inicial (FCTM_password) y marca FCTM_firstLogin como false. Requiere `SAOtoken`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: Contraseña establecida correctamente }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     tags: [Auth]
 *     summary: Cambiar contraseña (usuario autenticado)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string, format: password }
 *               newPassword: { type: string, format: password }
 *     responses:
 *       200: { description: Contraseña actualizada }
 *       400: { description: La nueva contraseña no es válida }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */

/**
 * @swagger
 * /auth/request-password-recovery:
 *   post:
 *     tags: [Auth]
 *     summary: Solicitar recuperación de contraseña
 *     description: Envía un correo con un enlace de recuperación al email de contacto indicado.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: Correo de recuperación enviado }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

/**
 * @swagger
 * /auth/change-password/{token}:
 *   post:
 *     tags: [Auth]
 *     summary: Cambiar contraseña con token de recuperación
 *     security: []
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Token de recuperación recibido por correo
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: Contraseña restablecida }
 *       400: { description: Token inválido o caducado }
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión
 *     description: Elimina la cookie `jwt`.
 *     security: []
 *     responses:
 *       200: { description: Sesión cerrada }
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener el usuario autenticado
 *     responses:
 *       200: { description: Datos del usuario en sesión }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     tags: [Auth]
 *     summary: Verificar correo electrónico
 *     security: []
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Correo verificado }
 *       400: { description: Token inválido o caducado }
 */

// 1 Login
router.post("/login", authController.login);

// 2 Login con SAO (desde sao.routes /sao/login)

// 3 Registrar el usuario con la información de SAO (si no exite en MongoDB)
// Proteger esta ruta PENDIENTE
router.post("/register-from-sao", protectSAO, authController.registerFromSAO);

// 4 Completar primer login (actualizar FCTM_password y FCTM_firstLogin)
router.post("/complete-first-login", protectSAO, authController.completeFirstLogin);


// 5 Cambiar password (requiere estar logueado y esto ya es algo opcional desde el Perfil del Usuario)
//router.patch("/change-password", protect, authController.changePassword);
//PENDIENTE
router.patch("/change-password", protect, authController.changePassword);

// 6 Solicitar recuperación de contraseña (pública)
router.post("/request-password-recovery", authController.requestPasswordRecovery);

// 7 Cambiar contraseña mediante token de recuperación (pública)
router.post("/change-password/:token", authController.changePasswordByToken);

router.post("/logout", authController.logout);
//Obtener información del usuario logueado
router.get("/me", protect, authController.getLoguedUser)

router.get("/verify-email/:token", authController.verifyEmail);

module.exports = router;
//LOGINSAOFCTM FIN