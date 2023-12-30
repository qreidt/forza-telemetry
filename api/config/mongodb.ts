import Env from '@ioc:Adonis/Core/Env'
import {MongoDbConfig} from "Contracts/mongodb";


const mongoDbConfig: MongoDbConfig = {
  uri: Env.get('MONGO_DB_URI')
};


export default mongoDbConfig;
