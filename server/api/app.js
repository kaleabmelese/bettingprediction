const express = require("express");
const db = require("../database/connection");
const router = express.Router();
const User = require("../../model/user");
const admin = require("../../model/admin");

router.get("/", User.homepage);
router.post("/signup", admin.signup);
router.post("/signin", admin.signin);
router.post("/saveprediction", admin.insertprediction);
router.post("/savefreetip", admin.insertfreetip);
router.get("/getprediction", User.getpredictions);
router.post("/deleteprediction", admin.deleteprediction);

module.exports = router;
