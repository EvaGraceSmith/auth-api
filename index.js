'use strict';

require('dotenv').config();
const server = require('./src/server.js');


//REWORK THIS !!!
const { db } = require('./src/auth/models');

//NEEDS To be this!!!!
// const { db } = require('./src/models');




db.sync().then(() => {
  server.start(process.env.PORT || 3001);
});
