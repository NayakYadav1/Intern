const { loadAndSplitPDF } = require("../models/pdfModel");

async function loadPDF(req, res) {
  try {
    const splits = await loadAndSplitPDF();
    res.send(splits[0].pageContent.slice(0, 500)); // Send the first 500 characters
  } catch (err) {
    res.status(500).send({ error: "Error loading PDF", details: err.message });
  }
}

module.exports = { loadPDF };