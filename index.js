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
      const companyEntity = await db.Company.findOne({ where: { siren } })
      const company = companyEntity.toJSON()
      const allCompanyResults = await db.CompanyResults.findAll({ where: { CompanyId: company.id } })
      return res.json({ ...company, results: allCompanyResults })
    } catch (error) {
      return res.send(error).status(500)
    }
  }
app.get('/api/companies/:siren', find)

const findAll = async (req, res) => {
    try {
        const Op = db.Sequelize.Op
      const { name = null, sector = null, page = 0, limit = 10 } = req.query
      let options = { 
        limit, 
        offset: page*limit 
        }
      if (!name && !sector) {
      }
      else if (name && !sector) {
        options.where = { name: { [Op.like]: `%${name}%` } }
      }
      else if (!name && sector) {
        options.where = { sector }
      }
      else {
        options.where = {
                [Op.and]: [{ name: { [Op.like]: `%${name}%`} }, { sector }]
            }
      }
      const companies = await db.Company.findAll(options)
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
    const company = await db.Company.findOne({ where: { siren } })
    if (!company) throw new Error('ERR_COMPANY_NOT_FOUND')
    const createdCompanyResults = await db.CompanyResults.create({ year, ca, margin, ebitda, loss, CompanyId: company.id }, { transaction })
    return res.json({ ...createdCompanyResults, siren })
  } catch (error) {
    console.log(error.message)
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
    const numberOfDeletedInstances = await db.Company.destroy({ where: whereCondition, transaction })
    await transaction.commit()
    return res.send(`${numberOfDeletedInstances} companies deleted`)
  } catch (error) {
    await transaction.rollback()
    return res.send(error).status(500)
  }
}
app.delete('/api/companies', deleteAll)
app.delete('/api/companies/:siren', deleteAll)


const populateDatabase = async (req, res) => {
    const transactionForCompanies = await db.sequelize.transaction()
    const transactionForResults = await db.sequelize.transaction()
    try {
        const companiesData = await fs.readJSON('./tkt_companies_data.json')
        await Promise.all(companiesData.map(async (data) => {
            const { name, sector, siren, results } = data
            const companyEntity = await db.Company.create({ name, sector, siren }, { transaction: transactionForCompanies })
            const { id } = companyEntity.toJSON()
            results.map(async (result) => {
                const { ca, margin, ebitda, loss, year } = result
                await db.CompanyResults.create({ ca, margin, ebitda, loss, year, CompanyId: id }, { transaction: transactionForResults })
            })
            return true
        }))
        await transactionForCompanies.commit()
        await transactionForResults.commit()
        return res.status(201)
    } catch (error) {
        await transactionForCompanies.rollback()
        await transactionForResults.rollback()
        return res.send(error).status(500)
    }
}
app.post('/api/companies/populate', populateDatabase)

// const compareCompanyResults = async (req, res) => {
//   try {
//     const { siren } = req.params
//     const company = await db.Company.findOne({ where: { siren } })
//     if (!company) throw new Error('ERR_COMPANY_NOT_FOUND')
//     const companyResults = await company.getCompanyResults()
//     if (!companyResults || !companyResults.length) throw new Error('ERR_NO_RESULTS_FOUND')
//     return true
//   } catch (error) {
    
//   }
// }
// app.post('/api/companies/:siren/compare', compareCompanyResults)

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`)
  await db.sequelize.sync()
})

module.exports = app
