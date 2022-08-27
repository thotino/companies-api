const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const db = require('./models')
const { createCompany, find, findAll, createCompanyResults, deleteAll, populateDatabase, compareCompanyResults } = require('./controllers')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('combined'))

const PORT = process.env.APP_SERVER_PORT || 3000

app.post('/api/companies', createCompany)

app.get('/api/companies/:siren', find)

app.get('/api/companies', findAll)

app.post('/api/companies/:siren/results', createCompanyResults)

app.delete('/api/companies', deleteAll)
app.delete('/api/companies/:siren', deleteAll)

app.post('/api/companies/populate', populateDatabase)

app.get('/api/companies/:siren/compare', compareCompanyResults)

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`)
  await db.sequelize.sync()
})

module.exports = app
