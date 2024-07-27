const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configura CORS
app.use(cors({
    origin: '*', // Permite todas las solicitudes, considera restringirlo a dominios específicos en producción
}));
app.use(express.json());

// Ruta para obtener el token
app.get('/api/token', async (req, res) => {
    try {
        const response = await axios.get('https://apis.andreani.com/login', {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.API_USER}:${process.env.API_PASSWORD}`).toString('base64')}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener el token:', error);
        res.status(500).json({ error: 'Error al obtener el token' });
    }
});

// Ruta para obtener los datos de traza
app.get('/api/envios/:trackingNumber/trazas', async (req, res) => {
    const { trackingNumber } = req.params;
    const token = req.headers['authorization'];

    try {
        const response = await axios.get(`https://apis.andreani.com/envios/${trackingNumber}/trazas`, {
            headers: {
                'Authorization': token
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener la traza:', error);
        res.status(500).json({ error: 'Error al obtener la traza' });
    }
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
