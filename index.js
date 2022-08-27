const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const db = require('./models')
const fs = require('fs-extra')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('combined'))

const PORT = process.env.APP_SERVER_PORT || 3000

const createCompany = async (req, res) => {
  const transaction = await db.sequelize.transaction()
  try {
    console.log(req.body)
    const { name, sector, siren } = req.body
    const createdCompany = await db.Company.create({ name, sector, siren }, { transaction })
    await transaction.commit()
    return res.json(createdCompany)
  } catch (error) {
    await transaction.rollback()
    return res.send(error).status(500)
  }
}

app.post('/api/companies', createCompany)

const find = async (req, res) => {
    try {
      const { siren } = req.params
      const company = await db.Company.findOne({ where: siren })
      console.log({ company })
      const allCompanyResults = await company.getCompanyResults()
      return res.json({ ...company, results: allCompanyResults })
    } catch (error) {
      return res.send(error).status(500)
    }
  }
app.get('/api/companies/:siren', find)

const findAll = async (req, res) => {

    try {
        const Op = db.Sequelize.Op
      const { name = null, sector = null } = req.query
      let whereCondition = {}
      if (!name && !sector) {
      }
      else if (name && !sector) {
        whereCondition = { where: { name: { [Op.like]: `%${name}%` } } }
      }
      else if (!name && sector) {
        whereCondition = { where: { sector } }
      }
      else {
        whereCondition = { 
            where: {
                [Op.and]: [{ name: { [Op.like]: `%${name}%`} }, { sector }]
            }
         }
      }
      const companies = await db.Company.findAll(whereCondition)
      return res.json(companies)
    } catch (error) {
      return res.send(error).status(500)
    }
  }

app.get('/api/companies', findAll)

const createCompanyResults = async (req, res) => {
  const transaction = await db.sequelize.transaction()
  try {
    const { siren } = req.params
    const { year, ca, margin, ebitda, loss } = req.body
    const company = await db.Company.findByPk(siren)
    if (!company) throw new Error('ERR_COMPANY_NOT_FOUND')
    const createdCompanyResults = await db.CompanyResults.create({ year, ca, margin, ebitda, loss }, { transaction })
    await company.setCompanyResults(createdCompanyResults)
    return res.json(company)
  } catch (error) {
    await transaction.rollback()
    return res.send(error).status(500)
  }
}

app.post('/api/companies/:siren/results', createCompanyResults)

const deleteAll = async (req, res) => {
  const transaction = await db.sequelize.transaction()
  try {
    const { siren } = req.params
    const whereCondition = siren ? { siren } : {}
    const numberOfDeletedInstances = await db.Tutorial.destroy({ where: whereCondition, transaction })
    await transaction.commit()
    return res.send(`${numberOfDeletedInstances} companies deleted`)
  } catch (error) {
    await transaction.rollback()
    return res.send(error).status(500)
  }
}

app.delete('/api/companies/:siren', deleteAll)
const populateDatabase = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    try {
        const companiesData = await fs.readJSON('./tkt_companies_data.json')
        await Promise.all(companiesData.map(async (data) => {
            const { name, sector, siren, results } = data
            await db.Company.create({ name, sector, siren }, { transaction })
            results.map(async (result) => {
                const { ca, margin, ebitda, loss, year } = result
                await db.CompanyResults.create({ ca, margin, ebitda, loss, year }, { transaction })
            })
            return true
        }))
        await transaction.commit()
        return res.status(201)
    } catch (error) {
        console.log(error.message)
        await transaction.rollback()
        return res.send(error).status(500)
    }
}
app.post('/api/companies/populate', populateDatabase)

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`)
  await db.sequelize.sync()
})

module.exports = app
