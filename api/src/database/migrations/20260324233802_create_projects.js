/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('projects', table => {
    table.increments('id').primary();
    table.integer('customer_id').unsigned().references('id').inTable('customers');
    table.string('name').notNullable();
    table.decimal('hourly_rate').notNullable();
    table.string('status').defaultTo('Pendente'); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('projects');
};