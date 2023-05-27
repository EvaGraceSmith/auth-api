'use strict';

// creates a record
// cannot create a record with a duplicate id
// cannot get all records with a bad token
// gets all records
// gets a single record
// updates a record
// deletes a record

const { server } = require('../src/server');
const supertest = require('supertest');
const request = supertest(server);
const { db, users } = require('../src/models');

let testAdmin;

beforeAll(async () => {
  await db.sync();
  testAdmin = await users.create({ username: 'testAdmin', password: '123', role: 'admin' });
},
);

afterAll(async () => {
  await db.drop();
},
);


describe('V2 Routes', () => {
  it('can create a record', async () => {
    let response = await request.post('/api/v2/food').send({
      name: 'test food',
      calories: 100,
      type: 'fruit',
    }).set('Authorization', `Bearer ${testAdmin.token}`);
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('test food');
    expect(response.body.calories).toEqual(100);
    expect(response.body.type).toEqual('fruit');
  },
  );

  it('cannot create a record with a duplicate id', async () => {
    let response = await request.post('/api/v2/food').send({
      name: 'test food',
      calories: 100,
      type: 'fruit',
    });
    expect(response.status).toEqual(500);
  },
  );

  it('cannot get all records with a bad token', async () => {
    let response = await request.get('/api/v2/food').set('Authorization', `Bearer ${testAdmin.token}`);
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('test food');
    expect(response.body[0].calories).toEqual(100);
    expect(response.body[0].type).toEqual('fruit');
  },
  );
  it('gets all records', async () => {
    let response = await request.get('/api/v2/food').set('Authorization', `Bearer ${testAdmin.token}`);
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('test food');
    expect(response.body[0].calories).toEqual(100);
    expect(response.body[0].type).toEqual('fruit');
  });

  it('gets a single record', async () => {
    let response = await request.get('/api/v2/food/1').set('Authorization', `Bearer ${testAdmin.token}`);
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('test food');
  });

  it('updates a record', async () => {
    let response = await request.put('/api/v2/food/1').send({
      name: 'test food',
      calories: 100,
      type: 'fruit',
    }).set('Authorization', `Bearer ${testAdmin.token}`);
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('test food');
    expect(response.body.calories).toEqual(100);
    expect(response.body.type).toEqual('fruit');
  });

  it('deletes a record', async () => {
    let response = await request.delete('/api/v2/food/1').set('Authorization', `Bearer ${testAdmin.token}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(1);
  });

},
);


