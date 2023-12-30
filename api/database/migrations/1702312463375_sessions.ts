import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary();

      table.integer('track_ordinal');
      table.integer('car_ordinal');
      table.json('light_data').nullable();

      table.timestamps({useTimestamps: true});
    });
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}
