/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';
import SessionManager from "App/Singletons/SessionManager";

Route.get('/', async () => {
  return {'hello': 'world'};
});

Route.get('/active-session', () => {
  return SessionManager.export();
});

Route.resource('/sessions', 'SessionsController')
  .only(['index', 'show']);

Route.get('/sessions/:session_id/telemetry', 'SessionsController.telemetry')
