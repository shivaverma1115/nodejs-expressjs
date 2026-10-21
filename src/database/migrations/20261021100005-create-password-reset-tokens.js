'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PasswordResetTokens', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tokenHash: { type: Sequelize.STRING(64), allowNull: false, unique: true },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      usedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('PasswordResetTokens', ['userId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('PasswordResetTokens');
  },
};
