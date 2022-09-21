import "reflect-metadata";

import config from './config';
import express from 'express';
// import loader from './loaders';

async function startServer() {
  const app = express();

  // const loader1 = await loader({expressApp: app})

  await require('./loaders').default({ expressApp: app });

  var port = 5000;

  app.listen(port, '0.0.0.0', () => {
    console.log(`
    ################################################
    Server listening on port: ${port} 
    ################################################`)

  }).on('error', err => {
    process.exit(1);
  });

}

startServer();

