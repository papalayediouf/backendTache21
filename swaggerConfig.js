const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de l\'application (Client, Prestataire, Admin)',
            version: '1.0.0',
            description: 'Documentation de l\'API pour gérer les utilisateurs, services, et rôles.',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Serveur local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], // Documentation générée pour les routes dans ce dossier
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
