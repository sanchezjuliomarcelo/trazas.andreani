const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config(); // Para manejar las variables de entorno

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para obtener el token (proxy para evitar CORS)
app.use('/api/token', createProxyMiddleware({
    target: 'https://apis.andreani.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/token': '/login',
    },
    onProxyReq: (proxyReq, req, res) => {
        // Añade las cabeceras necesarias para la autenticación
        proxyReq.setHeader('Authorization', `Basic ${Buffer.from(`${process.env.API_USER}:${process.env.API_PASSWORD}`).toString('base64')}`);
    }
}));

// Ruta para obtener los datos de traza (proxy para evitar CORS)
app.use('/api/envios', createProxyMiddleware({
    target: 'https://apis.andreani.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/envios': '', // Quita el prefijo `/api/envios` al hacer la solicitud a la API de Andreani
    },
    onProxyReq: (proxyReq, req, res) => {
        // Añade las cabeceras necesarias para la autenticación
        if (req.headers['authorization']) {
            proxyReq.setHeader('Authorization', req.headers['authorization']);
        }
    }
}));

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
