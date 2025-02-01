// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
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
};

const options = {
    swaggerDefinition,
    apis: ['./server.js'], // fichier où se trouvent les commentaires des routes
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;