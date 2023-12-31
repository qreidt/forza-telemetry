import type {Lap, Session} from "Contracts/db/session";
import SessionModel from 'App/Models/Session';
import MongoDbService from "App/Services/MongoDbService";

class SessionService {

  public async persistLap(session: Session, lap: Lap): Promise<void> {
    const label = this.getIdLabel(session.ID);
    const session_model = (await SessionModel.find(session.ID))!;
    lap._id = await MongoDbService.insertIntoCollection(`SData:${label}`, lap)

    const light_data = Object.assign({}, session);
    light_data.Laps = session.Laps.map(function (lap) {
      lap.Data = [];
      return lap;
    });

    session_model.lightData = light_data;
    await session_model.save();
  }

  public async persistSession(session: Session): Promise<void> {
    const label = this.getIdLabel(session.ID);
    const session_model = (await SessionModel.find(session.ID))!;
    await MongoDbService.insertManyIntoCollection(`SData:${label}`, session.Laps);

    const light_data = Object.assign({}, session);
    light_data.Laps = session.Laps.map(function (lap) {
      lap.Data = [];
      return lap;
    });

    session_model.lightData = light_data;
    await session_model.save();
  }

  private getIdLabel(id: number): string {
    return id.toString().padStart(5, '0')
  }

}

export default new SessionService();
