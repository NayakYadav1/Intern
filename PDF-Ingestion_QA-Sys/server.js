const express = require("express");
const dotenv = require("dotenv");
const pdfRoutes = require("./routes/pdfRoutes");
const qaRoutes = require("./routes/qaRoutes");

// Environment Configuration
dotenv.config();

// Initialize Express App
const app = express();
const PORT = 3000;

// Routes
app.use("/", pdfRoutes);
app.use("/qa", qaRoutes);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});