require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Pluggy = require('pluggy-sdk')
const app = express()

app.use(cors())
app.use(express.static('public'))

const client = new Pluggy.PluggyClient({
  clientId: process.env.PLUGGY_CLIENT_ID,
  clientSecret: process.env.PLUGGY_CLIENT_SECRET
})

app.get('/connect-token', async (req, res) => {
  try {
    const { accessToken } = await client.createConnectToken()
    console.log('Connect token obtido com sucesso:', accessToken)
    res.json({ connectToken: accessToken })
  } catch (err) {
    console.error('Erro ao obter connect token:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/transactions/:itemId', async (req, res) => {
  try {
    const transactions = await client.fetchTransactions({
      itemId: req.params.itemId,
      page: 1,
      pageSize: 100
    })
    res.json(transactions)
  } catch (err) {
    console.error('Erro ao buscar transações:', err)
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
