import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Session from "App/Models/Session";
import {bind} from "@adonisjs/route-model-binding";
import {Lap} from "Contracts/db/session";
import MongoDbService from "App/Services/MongoDbService";

export default class SessionsController {

  public async index() {
    return (await Session.all());
  }

  @bind()
  public async show({request}: HttpContextContract, session: Session): Promise<Session> {
    const query = request.qs();
    if (! ('load' in query) || ! Array.isArray(query.load)) {
      return session;
    }

    const ids: string[] = query.load;
    session.lightData!.Laps = await this.loadLapsData(
      session.collectionName,
      session.lightData!.Laps,
      ids, query.projection ?? null
    );

    return session;
  }

  @bind()
  public async telemetry({request}: HttpContextContract, session: Session) {
    const query = request.qs();
    const lap_ids: string[] = query.load ?? [];
    const projection: string[]|null = query.projection ?? null;

    const laps = session.lightData!.Laps
      .filter((lap) => lap_ids.includes(lap._id!));

    return await this.loadLapsData(
      session.collectionName,
      laps, lap_ids, projection
    );
  }

  private async loadLapsData(
    collection: string,
    laps: Lap[],
    ids: string[],
    projection: string[]|null = null
  ): Promise<Lap[]> {
    const lapsWithData = (await MongoDbService.findWhereIds(collection, ids, projection))
      .reduce((aggr, lap) => {
        aggr[lap._id!] = lap;
        return aggr;
      }, {} as Record<string, Lap>);

    return laps.map((lap) => {
      if (lap._id! in lapsWithData) {
        lap.Data = lapsWithData[lap._id!].Data;
      }

      return lap;
    });
  }

}
