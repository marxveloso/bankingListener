const axios = require('axios')

// Substitua com o token do vendedor sandbox que você já tem
const ACCESS_TOKEN = '7dda3ca2-550e-4c8a-91d3-2d00504ea23d688d800f4d0ba89dab873e1264628d19f1a0-118d-4554-b970-9d5458f338a3'

async function criarAplicacao() {
  try {
    const response = await axios.post(
      'https://sandbox.api.pagseguro.com/connect/v1/applications',
      {
        name: 'Recanto Connect',
        description: 'Aplicação para rastrear recebimentos via PagBank',
        redirect_uri: 'http://localhost:3000/callback',
        homepage_url: 'http://localhost:3000',
        support_email: 'contato@recantodobafo.com.br',
        permissions: ['payments.read', 'payments.create']
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('✅ Aplicação criada com sucesso:')
    console.log(response.data)
  } catch (error) {
    console.error('❌ Erro ao criar aplicação:')
    console.dir(error.response?.data || error.message)
  }
}

criarAplicacao()
