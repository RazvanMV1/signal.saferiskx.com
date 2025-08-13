// migrations/XXXXXX-add-fields-to-users.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'discordUsername', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'discordId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    
    await queryInterface.addColumn('Users', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });
    
    await queryInterface.addColumn('Users', 'isVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
    
    await queryInterface.addColumn('Users', 'activationToken', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Adaugă index pentru activationToken pentru căutări rapide
    await queryInterface.addIndex('Users', ['activationToken']);
    await queryInterface.addIndex('Users', ['discordId']);
  },

  async down(queryInterface, Sequelize) {
    // Șterge indexurile
    await queryInterface.removeIndex('Users', ['activationToken']);
    await queryInterface.removeIndex('Users', ['discordId']);
    
    // Șterge coloanele
    await queryInterface.removeColumn('Users', 'activationToken');
    await queryInterface.removeColumn('Users', 'isVerified');
    await queryInterface.removeColumn('Users', 'isActive');
    await queryInterface.removeColumn('Users', 'discordId');
    await queryInterface.removeColumn('Users', 'discordUsername');
  }
};
