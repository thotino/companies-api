'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CompanyResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.INTEGER
      },
      ca: {
        type: Sequelize.INTEGER
      },
      margin: {
        type: Sequelize.INTEGER
      },
      ebitda: {
        type: Sequelize.INTEGER
      },
      loss: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('CompanyResults')
  }
}
