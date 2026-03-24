/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', table => {
    table.increments('id').primary();
    table.integer('project_id').unsigned().references('id').inTable('projects');
    table.string('description').notNullable();
    table.integer('duration_minutes').defaultTo(0);
    table.decimal('amount_earned').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};
