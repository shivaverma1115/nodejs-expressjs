'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING(191), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      imageUrl: { type: Sequelize.STRING(1024), allowNull: true },
      categoryId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'Categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('Posts', ['userId']);
    await queryInterface.addIndex('Posts', ['categoryId']);
    await queryInterface.addIndex('Posts', ['title']);
    await queryInterface.sequelize.query(
      'ALTER TABLE Posts ADD FULLTEXT INDEX posts_fulltext_title_content (title, content)',
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Posts');
  },
};
