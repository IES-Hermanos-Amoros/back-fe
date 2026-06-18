require("dotenv").config()
const swaggerJsdoc = require("swagger-jsdoc")

const API_VERSION = process.env.API_VERSION || "v2"
const PORT = process.env.PUERTO || process.env.PORT || 3016
const PROTOCOL = process.env.USE_HTTPS == 1 ? "https" : "http"
const BASE_PATH = `/api/${API_VERSION}`

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API F.E. Manager — Backend",
            version: API_VERSION,
            description:
                "API REST para la gestión de la Formación en Empresa (FCT) del IES Hermanos Amorós.\n\n" +
                "Gestiona empresas, alumnado, profesorado, FCTs, documentos, ofertas de trabajo, reseñas, " +
                "aptitudes y la sincronización con SAO FCT.\n\n" +
                "## Autenticación\n" +
                "La mayoría de endpoints requieren un JWT. El token se entrega en una cookie `httpOnly` " +
                "llamada `jwt` al iniciar sesión (`POST /auth/login`), y también se acepta como " +
                "`Authorization: Bearer <token>`. Algunos endpoints de sincronización con SAO usan un token " +
                "aparte (`SAOtoken`).\n\n" +
                "## Perfiles\n" +
                "Los permisos dependen del perfil del usuario: `ADMINISTRADOR`, `PROFESOR`, `ALUMNO`, `EMPRESA`.",
            contact: {
                name: "IES Hermanos Amorós"
            },
            license: {
                name: "Uso académico"
            }
        },
        servers: [
            {
                url: `${PROTOCOL}://localhost:${PORT}${BASE_PATH}`,
                description: "Servidor local"
            }
        ],
        tags: [
            { name: "Auth", description: "Autenticación, sesión y recuperación de contraseña" },
            { name: "Companies", description: "Empresas (perfil EMPRESA)" },
            { name: "Students", description: "Alumnado (perfil ALUMNO)" },
            { name: "Teachers", description: "Profesorado (perfil PROFESOR)" },
            { name: "Administrators", description: "Administradores (perfil ADMINISTRADOR)" },
            { name: "FCT", description: "Formación en Empresa (convenios FCT)" },
            { name: "Documents", description: "Repositorio documental" },
            { name: "Job Offers", description: "Ofertas de trabajo" },
            { name: "Reviews", description: "Reseñas y su validación" },
            { name: "Skills", description: "Aptitudes / tecnologías" },
            { name: "Categories", description: "Familias profesionales" },
            { name: "Actions", description: "Acciones de seguimiento de tutoría" },
            { name: "Stats", description: "Estadísticas del panel" },
            { name: "SAO", description: "Sincronización con SAO FCT" },
            { name: "Enums", description: "Enumeraciones del sistema" },
            { name: "Dummy", description: "Datos de prueba (CRUD de ejemplo)" }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "jwt",
                    description: "JWT entregado como cookie httpOnly tras el login."
                },
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT en la cabecera Authorization."
                }
            },
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "error" },
                        message: { type: "string", example: "Descripción del error" }
                    }
                },
                Perfil: {
                    type: "string",
                    enum: ["ADMINISTRADOR", "PROFESOR", "ALUMNO", "EMPRESA"],
                    description: "Perfil del usuario en el sistema"
                },
                LoginRequest: {
                    type: "object",
                    required: ["username", "password"],
                    properties: {
                        username: { type: "string", example: "12345678A" },
                        password: { type: "string", format: "password", example: "miContraseña" }
                    }
                },
                Company: {
                    type: "object",
                    description: "Empresa (usuario con SAO_profile = EMPRESA)",
                    properties: {
                        _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
                        SAO_username: { type: "string", description: "CIF de la empresa", example: "B12345678" },
                        SAO_name: { type: "string", example: "Club Hípico Yerbabuena" },
                        SAO_company_FCT_Number: { type: "string", example: "272" },
                        SAO_company_FCT_Date: { type: "string", format: "date-time" },
                        SAO_company_city: { type: "string", example: "Villena" },
                        FCTM_company_category: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Category" }
                        },
                        FCTM_skills: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Skill" }
                        }
                    }
                },
                Student: {
                    type: "object",
                    description: "Alumno/a (usuario con SAO_profile = ALUMNO)",
                    properties: {
                        _id: { type: "string" },
                        SAO_username: { type: "string", description: "NIA del alumno", example: "10744014" },
                        SAO_name: { type: "string", example: "VICENTE PÉREZ JAVIER" },
                        SAO_student_city: { type: "string", example: "Villena" },
                        SAO_email: { type: "string", format: "email" },
                        SAO_phone: { type: "string" },
                        SAO_student_socialNumber: { type: "string", description: "NUSS" },
                        FCTM_skills: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Skill" }
                        }
                    }
                },
                Teacher: {
                    type: "object",
                    description: "Profesor/a (usuario con SAO_profile = PROFESOR)",
                    properties: {
                        _id: { type: "string" },
                        SAO_username: { type: "string", description: "NIF del profesor" },
                        SAO_name: { type: "string" },
                        SAO_email: { type: "string", format: "email" },
                        SAO_phone: { type: "string" }
                    }
                },
                FCT: {
                    type: "object",
                    description: "Convenio de Formación en Empresa",
                    properties: {
                        _id: { type: "string" },
                        SAO_fct_id: { type: "string" },
                        SAO_student_id: { type: "string", description: "NIA del alumno" },
                        SAO_student_fullname: { type: "string" },
                        SAO_company_id: { type: "string", description: "CIF de la empresa" },
                        SAO_company_name: { type: "string" },
                        SAO_company_city: { type: "string" },
                        SAO_dates: { type: "string", example: "28/05/2026 - 21/06/2026" },
                        SAO_hours: { type: "string", example: "0 / 102" },
                        SAO_period: { type: "string", example: "Ordinario, 2025-2026" },
                        FCTM_ies_instructor: { type: "string", description: "Tutor IES" },
                        FCTM_notes: { type: "string" }
                    }
                },
                Document: {
                    type: "object",
                    description: "Documento del repositorio",
                    properties: {
                        _id: { type: "string" },
                        FCTM_document_name: { type: "string", example: "Convenio.pdf" },
                        FCTM_document_description: { type: "string" },
                        FCTM_document_type: { type: "string", example: "GENERAL" },
                        FCTM_document_url: { type: "string", example: "/uploads/convenio.pdf" },
                        FCTM_visible_to_profiles: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Perfil" }
                        },
                        FCTM_document_created_by: { type: "string", description: "ID del usuario creador" }
                    }
                },
                JobOffer: {
                    type: "object",
                    description: "Oferta de trabajo",
                    properties: {
                        _id: { type: "string" },
                        FCTM_job_title: { type: "string", example: "Analista Programador VB.Net" },
                        FCTM_job_status: { type: "string", example: "ACTIVA" },
                        FCTM_job_start_date: { type: "string", format: "date-time" },
                        FCTM_job_end_date: { type: "string", format: "date-time" },
                        FCTM_skills: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Skill" }
                        },
                        empresa: { type: "string", description: "ID de la empresa que la publica" }
                    }
                },
                Review: {
                    type: "object",
                    description: "Reseña del sistema",
                    properties: {
                        _id: { type: "string" },
                        FCTM_review_title: { type: "string" },
                        FCTM_review_score: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                        FCTM_review_comment: { type: "string" },
                        FCTM_user_id: { type: "string", description: "Autor de la reseña" },
                        FCTM_review_verified: { type: "boolean" }
                    }
                },
                Skill: {
                    type: "object",
                    description: "Aptitud / tecnología",
                    properties: {
                        _id: { type: "string" },
                        FCTM_skill_name: { type: "string", example: "SpringBoot" },
                        FCTM_skill_verified: { type: "boolean" }
                    }
                },
                Category: {
                    type: "object",
                    description: "Familia profesional",
                    properties: {
                        _id: { type: "string" },
                        FCTM_category_name: { type: "string", example: "Desarrollo de Aplicaciones Web" }
                    }
                },
                Action: {
                    type: "object",
                    description: "Acción de seguimiento de tutoría",
                    properties: {
                        _id: { type: "string" },
                        FCTM_action_title: { type: "string" },
                        FCTM_action_type: { type: "string" },
                        FCTM_action_notes: { type: "string" },
                        FCTM_action_datetime: { type: "string", format: "date-time" }
                    }
                }
            },
            responses: {
                Unauthorized: {
                    description: "No autenticado (falta el JWT o es inválido)",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
                },
                Forbidden: {
                    description: "Autenticado pero sin permisos para esta acción",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
                },
                NotFound: {
                    description: "Recurso no encontrado",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
                }
            },
            parameters: {
                IdParam: {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Identificador (ObjectId) del recurso",
                    schema: { type: "string" }
                }
            }
        },
        security: [
            { cookieAuth: [] },
            { bearerAuth: [] }
        ]
    },
    apis: ["./routes/*.js"] // swagger-jsdoc lee las anotaciones @swagger de las rutas
}

const specs = swaggerJsdoc(options)
module.exports = specs
