import { gql } from 'apollo-server-express';
import AuthService from '../services/auth';

export const typeDef = gql`
  extend type Query {
    me: User
  }
  extend type Mutation {
    createAccount(email: String!, password: String!, profile: UserProfileInput!): UserAndToken!
    loginWithPassword(email: String!, password: String!): UserAndToken!
  }
  type UserAndToken {
    user: User!
    token: String!
  }
  type User {
    _id: ID!
    name: String!
  }
  input UserProfileInput {
    name: String!
  }
`;

export const resolvers = {
  User: {
    name: doc => doc.profile.name,
  },
  Query: {
    me: () => {
      return {
        _id: 'Test',
        name: 'Ihor Barmak',
      };
    },
  },
  Mutation: {
    createAccount: async (root, params) => {
      const { email, password, profile } = params;
      const { user, token } = await AuthService.createAccount(email, password, profile);

      return { user, token };
    },

    loginWithPassword: async (root, params) => {
      const { email, password } = params;
      const { user, token } = await AuthService.loginWithPassword(email, password);

      return { user, token };
    },
  },
};
