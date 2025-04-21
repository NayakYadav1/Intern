const express = require('express');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");

const PdfPath = "E:\\Downloads\\92151620-Watership-Down-The-classic-novel-by-Richard-Adams.pdf";

const loader = new PDFLoader(PdfPath);

// Create an endpoint to load and display the PDF content
app.get('/load-pdf', async (req, res) => {
    try {
        const docs = await loader.load();
        res.send(docs[0]); // Send the first document to the browser
    } catch (err) {
        res.status(500).send({ error: "Error loading PDF", details: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});