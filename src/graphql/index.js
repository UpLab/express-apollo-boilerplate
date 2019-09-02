import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // mocks: true,
  // mockEntireSchema: false,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
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
