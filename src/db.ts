import mongoose from 'mongoose';
import config from 'config';
import logger from 'jethro';

export default async () => {

  try {

    let db = await mongoose.connect(config.get("mongo"), {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

    logger("success", "Database", "Successfully connected to mongo database");

  } catch (err) {

    logger("error", "Database", "Unable to connect to mongo database");

  }

}