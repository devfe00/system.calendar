const { DataTypes } = require('sequelize');
const db = require('../config/db.js'); 

const Schedule = db.define('Schedule', {
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  serviceDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  serviceTime: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  serviceType: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
});

module.exports = Schedule;
