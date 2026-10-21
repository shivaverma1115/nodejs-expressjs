'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      content: { type: Sequelize.TEXT, allowNull: false },
      postId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Posts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('Comments', ['postId']);
    await queryInterface.addIndex('Comments', ['userId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Comments');
  },
};
