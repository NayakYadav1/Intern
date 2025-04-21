const express = require("express");
const { loadPDF } = require("../controllers/pdfController");

const router = express.Router();

router.get("/", loadPDF);

module.exports = router;