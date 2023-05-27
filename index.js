'use strict';

require('dotenv').config();
const { db } = require('./src/models');
const server = require('./src/server.js');
const PORT = process.env.PORT || 3001;


//REWORK THIS !!!


//NEEDS To be this!!!!
// const { db } = require('./src/models');




db.sync().then(() => {
  server.start(PORT);
});
