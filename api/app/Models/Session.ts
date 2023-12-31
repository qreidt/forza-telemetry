import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import { Session as SessionContract } from 'Contracts/db/session';

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({
    columnName: 'track_ordinal',
    serialize: (v) => v.toString(),
    serializeAs: 'trackOrdinal',
  })
  public trackOrdinal: string;

  @column({
    columnName: 'car_ordinal',
    serialize: (v) => v.toString(),
    serializeAs: 'carOrdinal',
  })
  public carOrdinal: string;

  @column({
    columnName: 'light_data',
    serializeAs: 'lightData',
    consume: Session.stringToJson,
    prepare: Session.jsonToString
  })
  public lightData: SessionContract|null

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime;

  get idLabel(): string {
    return `S${this.id.toString().padStart(5, '0')}`;
  }

  get collectionName(): string {
    return `SData:${this.id.toString().padStart(5, '0')}`;
  }

  public static jsonToString(value: null|string|object): null|string {
    if (! value) {
      return value;
    }

    if (typeof value === 'string') {
      return value;
    }

    value = JSON.stringify(value);
    return value;
  }

  public static stringToJson(value: null|string|object): null|object {
    if (value === null) {
      return value;
    }

    if (typeof value === 'object') {
      return value;
    }

    return JSON.parse(value);
  }
}
