import apolloServer from '../graphql';

export default async ({ app }) => {
  await apolloServer.applyMiddleware({ app });
  return apolloServer;
};
