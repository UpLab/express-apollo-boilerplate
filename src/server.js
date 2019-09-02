import express from 'express';
import apolloServer from './graphql';

const { PORT } = process.env;

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

// import { connectDb } from './models';

// connectDb()
//   .then(() => console.log('💾 Connected to the database'))
//   .then(() => server.listen())
//   .then(({ url }) => console.log(`🚀 Server ready at ${url}`))
//   .catch((error) => console.error(error));
apolloServer.applyMiddleware({ app });

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`));
