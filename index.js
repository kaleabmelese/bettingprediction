var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
// require("dotenv").config();

const psys = require("./server/api/app");
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/app", psys);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
