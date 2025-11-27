
/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.createTable('trackers', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('user_id').notNullable() // Auth0 user ID or guest ID
    table.boolean('is_guest').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  return knex.schema.dropTable('trackers')
}

