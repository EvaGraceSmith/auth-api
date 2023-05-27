//tests:
//   - errors out if route is not found
// error out if method is not found

//   - creates a new record in the DB
// gets all records
// gets a single records
// updates a record
// deletes a record

'use strict';

const { server } = require('../src/server');
const supertest = require('supertest');
const request = supertest(server);
const { db } = require('../src/models');

beforeAll(async () => {
  await db.sync();
},
);

afterAll(async () => {
  await db.drop();
},
);

describe('v1 Routes', () => {
  it('errors out if route is not found', async () => {
    let response = await request.post('/foo');
    expect(response.status).toEqual(404);
  },
  );
  it('errors out if method is not found', async () => {
    let response = await request.put('/food');
    expect(response.status).toEqual(404);
  },
  );
  it('creates a new record in the DB', async () => {

    let response = await request.post('/api/v1/food').send({
      name: 'test food',
      calories: 100,
      type: 'FRUIT',
    });
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('test food');
    expect(response.body.calories).toEqual(100);
    expect(response.body.type).toEqual('FRUIT');
  },
  );
  it('gets all records', async () => {
    let response = await request.get('/api/v1/food');
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('test food');
    expect(response.body[0].calories).toEqual(100);
    expect(response.body[0].type).toEqual('FRUIT');
  },
  );
  it('gets a single records', async () => {
    let response = await request.get('/api/v1/food/1');
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('test food');
    expect(response.body.calories).toEqual(100);
    expect(response.body.type).toEqual('FRUIT');
  },
  );
  it('updates a record', async () => {
    let response = await request.put('/api/v1/food/1').send({
      name: 'test food',
      calories: 200,
      type: 'FRUIT',
    });
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('test food');
    expect(response.body.calories).toEqual(200);
    expect(response.body.type).toEqual('FRUIT');
  },
  );
  it('deletes a record', async () => {
    let response = await request.delete('/api/v1/food/1');
    expect(response.status).toEqual(200);
  },
  );
},
);

