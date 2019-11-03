/* eslint-disable global-require */
import Logger from '../utils/logger';
import mongooseLoader from './mongoose';
import expressLoader from './express';
import agendaLoader from './agenda';
import apolloLoader from './apollo';
import eventsLoader from './events';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('💾 DB loaded and connected');

  await agendaLoader({ mongoConnection });
  Logger.info('⏱️ Agenda loaded');

  await eventsLoader();
  Logger.info('📅 Events loaded');

  await apolloLoader({ app: expressApp });
  Logger.info(`🚀 GraphQL Server is loaded`);

  await expressLoader({ app: expressApp });
  Logger.info('🚆 Express loaded');
  // Logger.info(`🚀 GraphQL Server ready at http://localhost:${expressApp.address().port}${apolloServer.graphqlPath}`);
};
