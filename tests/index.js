const request = require('supertest')
const assert = require('assert')
const app = require('../index')

/**
 * Testing create company endpoint
 */
describe('POST /api/companies', () => {
  const data = {
    name: 'tkt inc.',
    sector: 'Services',
    siren: 1234567890
  }
  it('respond with 200 and an object that matches what we created', async () => {
    const { body, status } = await request(app)
      .post('/api/companies')
      .set('Accept', 'application/json')
      .send(data)
    assert.strictEqual(status, 200)
    assert.strictEqual(body.name, 'tkt inc.')
    assert.strictEqual(body.sector, 'Services')
    assert.strictEqual(body.siren, 1234567890)
  })
})

/**
 * Testing create company accounting results endpoint
 */
describe.skip('POST /api/companies/:siren/results', () => {
  const data = {
    year: 2017,
    ca: 10,
    margin: 10,
    ebitda: 20,
    loss: 10
  }
  it('respond with 200 and an object that matches what we created', async () => {
    const { body, status } = await request(app)
      .post('/api/companies/1234567890/results')
      .set('Accept', 'application/json')
      .send(data)
    assert.strictEqual(status, 200)
    assert.strictEqual(body.year, 2017)
    assert.strictEqual(body.ca, 10)
    assert.strictEqual(body.margin, 10)
    assert.strictEqual(body.ebitda, 20)
    assert.strictEqual(body.loss, 10)
    assert.strictEqual(body.siren, 1234567890)
  })
})

/**
 * Testing get all companies endpoint
 */
describe('GET /api/companies', () => {
  it('respond with json containing a list that includes the company we just created', async () => {
    const { body, status } = await request(app)
      .get('/api/companies')
      .set('Accept', 'application/json')
    assert.strictEqual(status, 200)
    assert.strictEqual(body[0].name, 'tkt inc.')
    assert.strictEqual(body[0].sector, 'Services')
    assert.strictEqual(body[0].siren, 1234567890)
  })
})

/**
 * Testing get a single company endpoint
 */
describe.skip('GET /api/companies', () => {
  it('respond with json containing a list that includes the company we just created', async () => {
    const { body, status } = await request(app)
      .get('/api/companies/1234567890')
      .set('Accept', 'application/json')
    assert.strictEqual(status, 200)
    assert.strictEqual(body.name, 'tkt inc.')
    assert.strictEqual(body.sector, 'Services')
    assert.strictEqual(body.siren, 1234567890)
  })
})

/**
 * Testing delete company endpoint
 */
describe('DELETE /api/companies/1234567890', () => {
  it('respond with 200', async () => {
    const { status } = await request(app)
      .delete('/api/companies/1234567890')
      .set('Accept', 'application/json')
    assert.strictEqual(status, 200)
  })
})

/**
 * Testing get all companies endpoint
 */
describe('GET /api/companies', () => {
  it('respond with json containing no companies', async () => {
    const { body, status } = await request(app)
      .get('/api/companies')
      .set('Accept', 'application/json')
    assert.strictEqual(status, 200)
    assert.strictEqual(body.length, 0)
  })
})
