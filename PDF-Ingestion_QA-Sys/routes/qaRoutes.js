const express = require("express");
const { answerQuestion } = require("../controllers/qaController");

const router = express.Router();

router.get("/", answerQuestion);

module.exports = router;