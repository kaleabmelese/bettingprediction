const express = require("express");
const db = require("../../database/connection");
const router = express.Router();
const User = require("../../model/user");
const admin = require("../../model/admin");

router.post("/signup", admin.signup);
router.post("/signin", admin.signin);
router.post("/signout", admin.signout);
router.post("/saveprediction", admin.insertprediction);
router.post("/savefreetip", admin.insertfreetip);
router.post("/deleteprediction", admin.deleteprediction);

router.get("/", User.homepage);
router.get("/getprediction", User.getpredictions);
router.post("/buypackage", User.buypackage);

module.exports = router;
