'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyResults extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Company)
    }
  }
  CompanyResults.init({
    year: DataTypes.INTEGER,
    ca: DataTypes.INTEGER,
    margin: DataTypes.INTEGER,
    ebitda: DataTypes.INTEGER,
    loss: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CompanyResults',
  });
  return CompanyResults;
};