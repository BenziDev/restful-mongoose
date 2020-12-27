import express from 'express';
import config from 'config';
import db from './db';

// import controllers
import Auth from './controllers/auth';

let router = express();

const initDb = async () => {
  
  await db();

  // routes
  router.use("/auth", Auth(config));

};

initDb();

export default router;