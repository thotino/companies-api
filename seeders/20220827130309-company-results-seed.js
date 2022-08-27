'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('CompanyResults', [{
      ca: 2077357,
      margin: 497351,
      ebitda: 65952,
      loss: 858474,
      year: 2017,
      CompanyId: 135694027,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, {
      ca: 432070,
      margin: 427778,
      ebitda: 290433,
      loss: 8023406,
      year: 2016,
      CompanyId: 135694027,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, {
      ca: 364921,
      margin: 61976,
      ebitda: 960673,
      loss: 2812728,
      year: 2017,
      CompanyId: 107855014,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, {
      ca: 1944186,
      margin: 738525,
      ebitda: 846608,
      loss: 657145,
      year: 2016,
      CompanyId: 107855014,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
