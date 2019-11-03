import { gql } from 'apollo-server-express';

export const typeDef = gql`
  extend type Query {
    me: User
  }
  type User {
    _id: ID
    name: String
  }
`;

export const resolvers = {
  Query: {
    me: () => {
      return {
        _id: 'Test',
        name: 'Ihor Barmak',
      };
    },
  },
};
