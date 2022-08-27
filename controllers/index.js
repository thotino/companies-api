const db = require('../models')
const fs = require('fs-extra')

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

const findAll = async (req, res) => {
  try {
    const Op = db.Sequelize.Op
    const { name = null, sector = null, page = 0, limit = 10 } = req.query
    const options = {
      limit,
      offset: page * limit
    }
    if (!name && !sector) {
    } else if (name && !sector) {
      options.where = { name: { [Op.like]: `%${name}%` } }
    } else if (!name && sector) {
      options.where = { sector }
    } else {
      options.where = {
        [Op.and]: [{ name: { [Op.like]: `%${name}%` } }, { sector }]
      }
    }
    const companies = await db.Company.findAll(options)
    return res.json(companies)
  } catch (error) {
    return res.send(error).status(500)
  }
}

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
    return res.status(201).send({ updated: true })
  } catch (error) {
    await transactionForCompanies.rollback()
    await transactionForResults.rollback()
    return res.send(error).status(500)
  }
}

const compareCompanyResults = async (req, res) => {
  try {
    const { siren } = req.params
    const companyEntity = await db.Company.findOne({ where: { siren } })
    const company = companyEntity.toJSON()
    
    if (!company) throw new Error('ERR_COMPANY_NOT_FOUND')
    const companyResultsEntities = await db.CompanyResults.findAll({ where: { CompanyId: company.id } })
    if (!companyResultsEntities || !companyResultsEntities.length) throw new Error('ERR_NO_RESULTS_FOUND')

    const [firstYearData, secondYearData] = companyResultsEntities
    const firstYearResults = firstYearData.toJSON()
    const secondYearResults = secondYearData.toJSON()
    
    const comparison = {
      diffCA: (firstYearResults.ca - secondYearResults.ca) / secondYearResults.ca,
      diffMargin: (firstYearResults.margin - secondYearResults.margin) / secondYearResults.margin,
      diffLoss: (firstYearResults.loss - secondYearResults.loss) / secondYearResults.loss,
      diffEBITDA: (firstYearResults.ebitda - secondYearResults.ebitda) / secondYearResults.ebitda
    }
    return res.json(comparison)
  } catch (error) {
    console.log(error.message)
    return res.send(error).status(500)
  }
}

module.exports = { createCompany, createCompanyResults, find, findAll, deleteAll, populateDatabase, compareCompanyResults }
