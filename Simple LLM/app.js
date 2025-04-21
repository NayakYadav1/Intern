const express = require("express");
const dotenv = require("dotenv");

const app = express();
const PORT = 3000;

dotenv.config(); // Load environment variables from .env file

// Middleware to parse JSON
app.use(express.json());

// Import ChatGoogleGenerativeAI from @langchain/google-genai
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// Initialize the LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

// Create an endpoint to use the LLM
app.get("/translate", async (req, res) => {
    try {
      const aiMsg = await llm.invoke([
        [
          "system",
          "You are a helpful assistant that translates English to Nepali. Translate the user sentence.",
        ],
        ["human", "My name is Nayak Yadav. I love programming."],
      ]);
      res.send(aiMsg); // Send the AI response to the browser
    } catch (error) {
      res.status(500).send({ error: "An error occurred while processing your request." });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
