import {MongoClient, Db} from 'mongodb';
import mongoDbConfig from "Config/mongodb";


class MongoDbService {
  private readonly client: MongoClient;
  private readonly database: Db;

  constructor() {
    this.client = new MongoClient(mongoDbConfig.uri);
    this.database = this.client.db('telemetry');
  }

  public async insertIntoCollection(collection: string, document: any): Promise<void> {
    await this.database.collection(collection).insertOne(document);
  }

  public async insertManyIntoCollection(collection: string, documents: any[]): Promise<void> {
    await this.database.collection(collection).insertMany(documents);
  }

  public async getValues(): Promise<any> {
    return this.database.collection('forza').find({}, {
      limit: 20
    }).toArray();
  }
}

export default new MongoDbService();
