// models/subscription.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      Subscription.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  
  Subscription.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'cancelled'),
      allowNull: false,
      defaultValue: 'inactive'
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nextPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stripeCheckoutSessionId: {
    type: DataTypes.STRING,
    allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Subscription',
    timestamps: true,
    tableName: 'Subscriptions'
  });
  
  return Subscription;
};