import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public trackCode: number;

  @column()
  public carCode: number;

  @column()
  public startedAt: number;

  @column()
  public endedAt: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
