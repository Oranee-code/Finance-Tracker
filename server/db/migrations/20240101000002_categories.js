/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.createTable('categories', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('type').notNullable() // 'income' or 'expense'
    table.string('user_id').notNullable()
    table.boolean('is_guest').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  return knex.schema.dropTable('categories')
}

