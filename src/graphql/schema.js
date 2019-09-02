import { gql } from 'apollo-server-express';

const typeDefs = gql`
type Query {
  helloWorld: String
}


schema {
  query: Query
}
`;

export default typeDefs;
