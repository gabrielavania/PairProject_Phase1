'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
      const posts = require('../data/posts.json')
    posts.forEach((el) => {
      // console.log(el.body.length)
      el.updatedAt = el.createdAt = new Date()
    })

    await queryInterface.bulkInsert('Posts', posts, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Posts', null, {
      restartIdentity: true,
      truncate: true
    })
  }
};
