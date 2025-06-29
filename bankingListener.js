require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');



const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const BELVO_ID = process.env.BELVO_SECRET_ID;
const BELVO_PW = process.env.BELVO_SECRET_PASSWORD;

// Endpoint para gerar um access_token temporário para o widget
app.post('/api/create-widget-token', async (req, res) => {
  try {
    const response = await axios.post(
      'https://sandbox.belvo.com/api/tokens/',
      {},
      {
        auth: {
          username: BELVO_ID,
          password: BELVO_PW,
        },
      }
    );
    res.json({ access: response.data.access });
  } catch (err) {
    // Print detalhado do erro no terminal
    console.error(
      '[Belvo ERROR]',
      'Status:', err.response?.status,
      'Mensagem:', err.message,
      'Corpo:', err.response?.data
    );
    res.status(500).json({ error: err.message, details: err.response && err.response.data });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
