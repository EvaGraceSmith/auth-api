'use strict';

const {server}=require('../src/server');
const supertest=require('supertest');
const {db}=require('../src/models/index');
const request=supertest(server);

//this will create a new database for testing
beforeAll(async()=>{
  await db.sync();
},
);

// this will clean up any records created while testing.
afterAll(async()=>{
  await db.drop();
},
);

describe('Auth router',()=>{
  let token;
  it('can create a new user',async()=>{
    const response=await request.post('/signup').send({username:'test',password:'passtest'});
    token=response.body.user.token;
    expect(response.status).toEqual(201);
    expect(response.body.user.username).toEqual('test');
  });

  //test for:
  // 1. user can signin with basic auth

  //2. fails with a bad signin

  it('can signin with basic auth',async()=>{
    const response=await request.post('/signin').auth('test','passtest');
    expect(response.status).toEqual(200);
    expect(response.body.user.username).toEqual('test');
  },
  );

  it('fails with a bad signin',async()=>{
    const response=await request.post('/signin').auth('test','wrongpass');
    expect(response.status).toEqual(403);
    expect(response.text).toEqual('Invalid Login');
  },
  );
  //3 allows access to /secret with any valid token

  it('allows access to /secret with any valid token',async()=>{
    const response=await request.get('/secret').set('Authorization',`Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('Welcome to the secret area');
  },
  );
    
},
);

