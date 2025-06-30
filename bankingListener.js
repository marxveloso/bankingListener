require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas de callback públicas para o Widget Belvo
app.get('/success', (req, res) => {
  res.send('✅ Conta conectada com sucesso!');
});

app.get('/exit', (req, res) => {
  res.send('⚠️ Processo cancelado pelo usuário.');
});

app.get('/error', (req, res) => {
  res.send('❌ Ocorreu um erro ao conectar a conta.');
});

const BELVO_ID = process.env.BELVO_SECRET_ID;
const BELVO_PW = process.env.BELVO_SECRET_PASSWORD;
console.log(BELVO_ID ? 'BELVO_SECRET_ID carregado com sucesso.' : 'Erro: BELVO_SECRET_ID não definido!');
console.log(BELVO_PW ? 'BELVO_SECRET_PASSWORD carregado com sucesso.' : 'Erro: BELVO_SECRET_PASSWORD não definido!');

// Endpoint para gerar um widget access token atualizado
app.post('/api/create-widget-token', async (req, res) => {
  try {
    // Substitua os valores fixos pelos dados reais da sua aplicação ou do frontend conforme necessidade
    const data = {
      id: BELVO_ID,
      password: BELVO_PW,
      scopes: "read_institutions,write_links,read_consents,write_consents,write_consent_callback,delete_consents",
      stale_in: "90d",
      fetch_resources: ["ACCOUNTS", "TRANSACTIONS", "OWNERS", "BILLS"],
      widget: {
        purpose: "Soluções financeiras personalizadas oferecidas por meio de recomendações sob medida, visando melhores ofertas de produtos financeiros e de crédito.",
        openfinance_feature: "consent_link_creation",
        callback_urls: {
          success: "https://bankinglistener-production.up.railway.app/success",
          exit:    "https://bankinglistener-production.up.railway.app/exit",
          event:   "https://bankinglistener-production.up.railway.app/error"
        },
        branding: {
          company_icon: "https://bankinglistener-production.up.railway.app/static/icon.svg",
          company_logo: "https://bankinglistener-production.up.railway.app/static/logo.svg",
          company_name: "Recanto do Bafo",
          company_terms_url: "https://bankinglistener-production.up.railway.app/termos",
          overlay_background_color: "#F0F2F4",
          social_proof: true
        },
        theme: [
          {
            css_key: "--color-primary-base",
            value: "#907AD6"
          }
        ],
        consent: {
          terms_and_conditions_url: "https://bankinglistener-production.up.railway.app/termos",
          permissions: ["REGISTER","ACCOUNTS","CREDIT_CARDS","CREDIT_OPERATIONS"],
          identification_info: [
            {
              type: "CPF",
              number: "76109277673",
              name: "Ralph Bragg"
            }
          ]
        }
      }
    };

    const response = await axios.post(
      'https://sandbox.belvo.com/api/token/',
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({
      access: response.data.access,
      refresh: response.data.refresh
    });
  } catch (err) {
    console.error(
      '[Belvo ERROR]',
      'Status:', err.response?.status,
      'Mensagem:', err.message,
      'Corpo:', err.response?.data
    );
    res.status(500).json({
      error: err.message,
      details: err.response && err.response.data
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
