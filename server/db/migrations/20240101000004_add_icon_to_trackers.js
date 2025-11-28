/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.alterTable('trackers', (table) => {
    table.string('icon').defaultTo('Wallet')
  })
}

/**
 * @param {import('knex').Knex} knex
 */
export async function down(knex) {
  return knex.schema.alterTable('trackers', (table) => {
    table.dropColumn('icon')
  })
}

