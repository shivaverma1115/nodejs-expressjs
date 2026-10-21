'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(191), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: true },
      role: { type: Sequelize.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
      isEmailVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      googleId: { type: Sequelize.STRING(191), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('Users', ['googleId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  },
};
