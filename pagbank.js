const APP_ID = 'recantodobafo@hotmail.com'
const APP_KEY = '7dda3ca2-550e-4c8a-91d3-2d00504ea23d688d800f4d0ba89dab873e1264628d19f1a0-118d-4554-b970-9d5458f338a3'

const express = require('express')
const axios = require('axios')
const app = express()

// Substitua com seu client_id real após criar a aplicação
const CLIENT_ID = 'recantodobafo@hotmail.com'
const REDIRECT_URI = 'http://localhost:3000/callback'

// Rota inicial para gerar e exibir o link de autorização
app.get('/', (req, res) => {
  const authUrl = `https://connect.sandbox.pagseguro.uol.com.br/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=payments.read+payments.create&state=recanto123`
  res.send(`<a href="${authUrl}" target="_blank">👉 Autorizar aplicação no PagBank</a>`)
})

// Rota de callback que recebe o code
app.get('/callback', async (req, res) => {
  const { code, state } = req.query
  if (!code) return res.send('❌ Código de autorização não recebido.')

  try {
    const response = await axios.post('https://sandbox.api.pagseguro.com/connect/v1/oauth2/tokens', {
      grant_type: 'authorization_code',
      code: code,
      client_id: CLIENT_ID
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    console.log('✅ Access Token:', response.data.access_token)
    res.send(`<pre>✅ Access Token recebido com sucesso:\n\n${JSON.stringify(response.data, null, 2)}</pre>`)
  } catch (err) {
    console.error('❌ Erro ao trocar o código pelo token:', err.response?.data || err.message)
    res.send(`<pre>❌ Erro ao obter token:\n${JSON.stringify(err.response?.data || err.message, null, 2)}</pre>`)
  }
})

// Iniciar servidor local
app.listen(3000, () => {
  console.log('🚀 Acesse http://localhost:3000 para iniciar a autorização')
})
