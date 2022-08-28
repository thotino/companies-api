const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const db = require('./models')
const { createCompany, find, findAll, createCompanyResults, deleteAll, populateDatabase, compareCompanyResults } = require('./controllers')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = process.env.APP_SERVER_PORT || 3000

// Create company endpoint
app.post('/api/companies', createCompany)

// Find companies endpoints
app.get('/api/companies/:siren', find)
app.get('/api/companies', findAll)

// Create company accounting results endpoint
app.post('/api/companies/:siren/results', createCompanyResults)

// Delete company and accounting results endpoints
app.delete('/api/companies', deleteAll)
app.delete('/api/companies/:siren', deleteAll)

// Populate local database endpoint
app.post('/api/companies/populate', populateDatabase)

// Compare the accounting resultsof a single company endpoint
app.get('/api/companies/:siren/compare', compareCompanyResults)

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`)
  await db.sequelize.sync()
})

module.exports = app
