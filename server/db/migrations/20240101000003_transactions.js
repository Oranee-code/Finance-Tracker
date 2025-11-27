/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary()
    table.integer('tracker_id').notNullable().references('trackers.id').onDelete('CASCADE')
    table.string('type').notNullable() // 'income' or 'expense'
    table.decimal('amount', 10, 2).notNullable()
    table.integer('category_id').references('categories.id').onDelete('SET NULL')
    table.string('category_name') // Store category name for display
    table.date('transaction_date').notNullable()
    table.text('notes')
    table.string('user_id').notNullable()
    table.boolean('is_guest').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  return knex.schema.dropTable('transactions')
}

