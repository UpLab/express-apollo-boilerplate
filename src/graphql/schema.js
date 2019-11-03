import { makeExecutableSchema, gql } from 'apollo-server-express';
import merge from 'lodash/merge';
import { typeDef as User, resolvers as userResolvers } from './user';

const Common = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [Common, User],
  resolvers: merge(userResolvers),
});

export default schema;
