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
    await queryInterface.bulkInsert('Companies', [
      {
        name: 'Reinger Inc',
        sector: 'Services',
        siren: 135694027,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        name: 'Torphy, Rosenbaum and Rempel',
        sector: 'Electronic',
        siren: 107855014,
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
    await queryInterface.bulkDelete('Companies', { siren: { [Sequelize.Op.in]: [135694027, 107855014] } })
  }
}
