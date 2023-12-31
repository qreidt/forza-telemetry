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
  public async show({request}: HttpContextContract, session: Session) {
    const query = request.qs();
    if (! ('load' in query) || ! Array.isArray(query.load)) {
      return session;
    }

    const project = ('project' in query)
      ? Object.keys(query.project)
      : null;

    const ids: string[] = query.load;
    session.lightData!.Laps = await this.loadLapsData(
      session.collectionName,
      session.lightData!.Laps,
      ids, project
    );

    return session;
  }


  private async loadLapsData(collection: string, laps: Lap[], ids: string[], project: string[]|null = null): Promise<Lap[]> {
    const lapsWithData = (await MongoDbService.findWhereIds(collection, ids, project))
      .reduce((aggr, lap) => {
        aggr[lap._id!] = lap;
        return aggr;
      }, {});

    return laps.map((lap) => {
      if (lap._id! in lapsWithData) {
        lap.Data = lapsWithData[lap._id!].Data;
      }

      return lap;
    });
  }

}
