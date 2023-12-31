import {MongoClient, Db, ObjectId, WithId, FindOptions} from 'mongodb';
import mongoDbConfig from "Config/mongodb";
import {Lap} from "Contracts/db/session";


class MongoDbService {
  private readonly client: MongoClient;
  private readonly database: Db;

  constructor() {
    this.client = new MongoClient(mongoDbConfig.uri);
    this.database = this.client.db('telemetry');
  }

  public async insertIntoCollection<T>(collection: string, document: T): Promise<string> {
    return (await this.database.collection(collection).insertOne(document)).insertedId.toString();
  }

  public async insertManyIntoCollection(collection: string, documents: any[]): Promise<void> {
    await this.database.collection(collection).insertMany(documents);
  }

  public async findWhereIds(collection: string, ids: string[], project: string[]|null): Promise<Lap[]> {
    const filter = { _id: {$in: ids.map(id => new ObjectId(id))} };
    const options: FindOptions = {};

    if (project) {
      options.projection = project.reduce((projection, column: string) => {
        projection[`Data.${column}`] = 1;
        return projection;
      }, {_id: 1});
    }

    const cursor = await this.database.collection(collection).find(filter, options);
    const data = await cursor.toArray() as unknown as WithId<Lap>[];

    return data.map((document) => {
      document._id = document._id.toString();
      return document as unknown as Lap;
    });
  }
}

export default new MongoDbService();
