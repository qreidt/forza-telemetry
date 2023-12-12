import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary();

      table.integer('track_code');
      table.integer('car_code');

      table.timestamp('started_at');
      table.timestamp('ended_at');

      table.timestamps({useTimestamps: true});
    });
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}
