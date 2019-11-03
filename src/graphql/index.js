import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import config from '../config';

const server = new ApolloServer({
  schema,
  // mocks: true,
  // mockEntireSchema: false,
  introspection: true,
  playground: config.isDevelopment,
  context: async ({ req }) => {
    // TODO: handle auth
    const token = (req.headers && req.headers.authorization) || '';
    // if the email isn't formatted validly, return null for user
    if (!token) return { user: null };
    // find a user by their email
    // const user = await User.findUserByToken(token);
    return { user: null };

    // return {
    //   user,
    // };
  },
});

export default server;
