/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.alterTable('trackers', (table) => {
    table.string('color').defaultTo('#0d9488')
  })
}

/**
 * @param {import('knex').Knex} knex
 */
export async function down(knex) {
  return knex.schema.alterTable('trackers', (table) => {
    table.dropColumn('color')
  })
}
