// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Maxime Dubois',
            version: '1.0.0',
            description: 'Une API pour récupérer des informations sur les utilisateurs et la progression des promotions.',
        },
        servers: [
            {
                url: 'https://api-01-edu.vercel.app',
            },
        ],
        components: {
            securitySchemes:
                {
                    JWT:
                        {
                            name: 'User Authorization',
                            description: 'Value: Bearer {token}',
                            type: 'apiKey',
                            scheme: 'bearer',
                            in: 'header',
                            bearerFormat: 'JWT'
                        }
                }
        }
    },
    apis: ['./server.js']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const options = {
    customCss: '.swagger-ui .topbar { display: none }'
}
export default swaggerUi.setup(swaggerDocs, options);