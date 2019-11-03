import { ApolloServer } from 'apollo-server-express';
import AuthService from '../services/auth';
import UserModel from '../models/users';
import schema from './schema';
import config from '../config';

const getTokenFromHeader = req => {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').replace('Token ', '');
  return token;
};

const server = new ApolloServer({
  schema,
  // mocks: true,
  // mockEntireSchema: false,
  introspection: true,
  playground: config.isDevelopment,
  context: async ({ req }) => {
    const token = getTokenFromHeader(req);
    if (!token) return { user: null };

    const decoded = AuthService.validateToken(token);
    if (!decoded) return { user: null };
    // eslint-disable-next-line no-underscore-dangle
    const user = await UserModel.findById(decoded._id);
    return { user };
  },
});

export default server;
