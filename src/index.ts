import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import logger from 'jethro';

import config from 'config';
import routes from './routes';

const app = express();
const server = http.createServer(app);

// apply middleware
app.use(helmet());

app.use(bodyParser.json({
  limit: "100kb"
}));

app.get("/", (req, res) => {
  res.status(200).json({"statusCode":200,"online":true});
});

app.use(compression({
  level: 2
}));

app.use("/v1", routes);

// 404 error handler
app.all("*", (req, res) => {
  res.status(404).json({"statusCode":404,"error":"Not Found","message":"No such endpoint."});
});

server.listen(config.get("port"), () => logger("success", "HTTP", `Server now listening on port ${config.get("port")}`));

export default app;
