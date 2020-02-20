var express = require("express");
var bodyParser = require("body-parser");
const dbConfigObj = require('./knexfile')
var cors = require("cors");
// require("dotenv").config();
let dbConnectionConfig

switch (process.env.NODE_ENV){
  case 'production':
    dbConnectionConfig = dbConfigObj.production :
    break;
  default:
    dbConnectionConfig = dbConfigObj.development
}

const appDb = connectToDb(dbConnectionConfig)
Model.knex(appDb)

const psys = require("./server/api/app");
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/app", psys);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running at ${port}`, '\n DATABASE_URL: ', process.env.DATABASE_URL);
});
