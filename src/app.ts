import "reflect-metadata";

import config from './config';
import express from 'express';

async function startServer() {
  const app = express();

  // const loader1 = await loader({expressApp: app})

  await require('./loaders').default({ expressApp: app });

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`
    ------------------------------------------------
    ################################################
    Server listening on port: ${port} 
    ################################################`)

  }).on('error', err => {
    process.exit(1);
  });

}

startServer();

