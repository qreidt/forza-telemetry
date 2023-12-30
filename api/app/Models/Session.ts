import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import {afterFetch, beforeSave, beforeUpdate} from "@adonisjs/lucid/build/src/Orm/Decorators";
import { Session as SessionContract } from 'Contracts/db/session';

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({columnName: 'track_ordinal'})
  public trackOrdinal: string;

  @column({columnName: 'car_ordinal'})
  public carOrdinal: string;

  @column({columnName: 'light_data'})
  public lightData: SessionContract|string|null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  @beforeUpdate()
  public static toString(session: Session): Session {
    if (! session.lightData) {
      return session;
    }

    if (typeof session.lightData === 'string') {
      return session;
    }

    session.lightData = JSON.stringify(session.lightData);
    return session;
  }

  @afterFetch()
  public static toJson(session: Session): Session {
    if (! session.lightData) {
      return session;
    }

    if (typeof session.lightData === 'object') {
      return session;
    }

    session.lightData = JSON.stringify(session.lightData);
    return session;
  }
}
