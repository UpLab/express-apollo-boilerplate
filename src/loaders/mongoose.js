/* eslint-disable global-require */
import mongoose from 'mongoose';
// import beautifyUnique from 'mongoose-beautiful-unique-validation';
import config from '../config';
import Logger from '../utils/logger';

export default async () => {
  Logger.silly('Connecting to MongoDB...');
  const connection = await mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  Logger.silly('Connected');
  // we need to load this plugin after all of the models are loaded.
  // ref: https://www.npmjs.com/package/mongoose-beautiful-unique-validation#usage
  // console.log('Attaching beautify unique');
  // mongoose.plugin(beautifyUnique);

  // Load all models
  Logger.silly('Loading projects model...');
  await require('../models/invoices');
  Logger.silly('Loaded projects model');

  Logger.silly('Loading reports model...');
  await require('../models/projects');
  Logger.silly('Loaded reports model');

  Logger.silly('Loading teams model...');
  await require('../models/reports');
  Logger.silly('Loaded teams model');

  Logger.silly('Loading time-entries model...');
  await require('../models/teams');
  Logger.silly('Loaded time-entries model');

  Logger.silly('Loading users model...');
  await require('../models/time-entries');
  Logger.silly('Loaded users model');

  Logger.silly('Loading invoices model...');
  await require('../models/users');
  Logger.silly('Loaded invoices model');

  return connection.connection.db;
};
