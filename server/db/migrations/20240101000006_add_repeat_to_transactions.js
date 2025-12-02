/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.string('repeat').defaultTo('never')
  })
}

export async function down(knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('repeat')
  })
}

