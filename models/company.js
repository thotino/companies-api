'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // TO DO: Use siren as the PK
      this.hasMany(models.CompanyResults)
    }
  }
  Company.init({
    name: DataTypes.STRING,
    sector: DataTypes.STRING,
    siren: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Company'
  })
  return Company
}
