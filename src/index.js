/* eslint-disable global-require */
import express from 'express';
import config from './config';

import Logger from './utils/logger';

async function startServer() {
  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   * */
  await require('./loaders').default({ expressApp: app });
  const apolloServer = await require('./graphql').default;

  app.listen(config.port, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }

    Logger.info(`
      #############################################
        Server listening on port: ${config.port} 
        Address: http://localhost:${config.port} ️
      ️  GraphQL: http://localhost:${config.port}${apolloServer.graphqlPath}
      #############################################
    `);
  });
}

startServer();
