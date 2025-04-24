// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import UsageLog from "./models/UsageLog.js";

dotenv.config();

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // 1) Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);

    // 2) (Optional) Inspect the raw result to find stats
    // console.log(JSON.stringify(result, null, 2));

    // 3) Extract the generated text
    const response = await result.response;
    const generatedText = await response.text();

    // 4) Pull token + cost info from the right field
    const stats      = result.metadata || result.requestStats || {};
    const tokenCount = typeof stats.totalTokens === "number" ? stats.totalTokens : null;
    const cost       = typeof stats.totalCost    === "number" ? stats.totalCost    : null;

    // 5) Save only if stats are valid
    if (tokenCount !== null && cost !== null) {
      const usageLog = new UsageLog({
        model:      "gemini-1.5-flash",
        prompt,
        tokenCount,
        cost,
      });
      await usageLog.save();
    } else {
      console.warn("⚠️ Missing token/cost stats; skipping DB save.", stats);
    }

    // 6) Return everything to the client
    return res.json({
      success:       true,
      prompt,
      generatedText,
      tokenCount,
      cost,
    });
  } catch (error) {
    console.error("❌ Error during model generation:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
