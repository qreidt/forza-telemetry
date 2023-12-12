import Database from '@ioc:Adonis/Lucid/Database';

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

Route.get('/', async () => {
  return {'hello': 'world'};
});

Route.get('/sessions', async () => {
  return Database.from('sessions').select('*');
});

Route.get('/teste', async () => {

  const values = [
    {hex: '01000000', expected_value: 1, type: 's32', value: null},
    {hex: '64ad2800', expected_value: 2665828, type: 'u32', value: null},
    {hex: 'f0a6f945', expected_value: 7988.8671875, type: 'f32', value: null},
    {hex:     '0b00', expected_value: 11, type: 'u8', value: null},
    {hex:       '90', expected_value: -112, type: 's8', value: null},
  ];



  return values.map(function (item) {
    const buffer = Buffer
      .from(item.hex, 'hex');

    item.value = matchOnType(item.type, buffer);
    console.log(`${item.hex} => ${item.value}`);
    return item;
  });
});
