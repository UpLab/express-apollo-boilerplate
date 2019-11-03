/* eslint-disable global-require */
// Here we import all events
export default async () => {
  await require('../subscribers/user');
};
