const express = require("express");
const db = require("../database/connection");
const router = express.Router();
const User = require("../../model/user");
const admin = require("../../model/admin");

// router.get("/", async (req, res) => {
//   // var getdata=await
// });

router.get("/", (req, res) => {
  db.fetch().then(result => {
    res.status(200).json(result);
    console.log(JSON.stringify(result));
  });

  // res.status(500).json(db.fetch());
});

router.post("/insert/client", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  // const tablename = req.params.tablename;
  db.insert(fname, lname).then(result => {
    console.log(JSON.stringify(result));
    res.status(200).json(result);
  });
});

router.post("/signup", User.signup);
router.post("/signin", User.signin);
router.post("/saveprediction", admin.insert);
router.get("/getprediction", User.getpredictions);

module.exports = router;
