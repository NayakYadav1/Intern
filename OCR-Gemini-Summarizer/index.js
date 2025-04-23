import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Main function
async function extractAndSummarize() {
  try {
    const imagePath = path.resolve("screenshots", "1.png");

    // 1️⃣ OCR - Extract text from image
    const { data: { text: extractedText } } = await Tesseract.recognize(imagePath, "eng");
    console.log("📄 Extracted Text:\n", extractedText);

    // 2️⃣ Summarize using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Summarize this text:\n\n${extractedText}`);
    const response = await result.response;
    const summary = await response.text();
    console.log("📝 Summarized Text:\n", summary);

    // 3️⃣ Save to folder
    const folderPath = path.resolve("ocr_output");
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    fs.writeFileSync(path.join(folderPath, "extracted.txt"), extractedText);
    fs.writeFileSync(path.join(folderPath, "summary.txt"), summary);

    console.log("✅ Both texts saved in 'ocr_output' folder.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

extractAndSummarize();
