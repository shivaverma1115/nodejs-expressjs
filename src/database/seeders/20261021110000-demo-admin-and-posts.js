'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const password = await bcrypt.hash('Admin@12345', 12);

    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        password,
        role: 'admin',
        isEmailVerified: true,
        googleId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: 'Demo User',
        email: 'user@example.com',
        password: await bcrypt.hash('User@12345', 12),
        role: 'user',
        isEmailVerified: true,
        googleId: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('Categories', [
      { id: 1, name: 'General', createdAt: now, updatedAt: now },
      { id: 2, name: 'Engineering', createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('Posts', [
      {
        id: 1,
        title: 'Welcome to the API',
        content: 'This is a seeded post used for interview demos of pagination, search, and caching.',
        imageUrl: null,
        categoryId: 1,
        userId: 1,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Posts', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
