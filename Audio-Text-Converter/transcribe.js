// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// async function transcribeAudio() {
//   try {
//     const audioPath = path.resolve("audio", "1.mp3");
//     const audioData = fs.readFileSync(audioPath);
//     const base64Audio = audioData.toString("base64");

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent([
//       {
//         inlineData: {
//           mimeType: "audio/mpeg",
//           data: base64Audio,
//         },
//       },
//       "Transcribe this audio to plain text.",
//     ]);

//     const response = await result.response;
//     const text = await response.text();

//     console.log("📝 Transcribed Text:");
//     console.log(text);
//   } catch (error) {
//     console.error("❌ Error:", error.message);
//   }
// }

// transcribeAudio();


// Transcribe the audiio file to text and store that text in a file named transcribed_docs

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function transcribeAudio() {
  try {
    const audioPath = path.resolve("audio", "1.mp3");
    const audioData = fs.readFileSync(audioPath);
    const base64Audio = audioData.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/mpeg",
          data: base64Audio,
        },
      },
      "Transcribe this audio to plain text.",
    ]);

    const response = await result.response;
    const text = await response.text();

    console.log("📝 Transcribed Text:");
    console.log(text);

    // Create folder if it doesn't exist
    const folderPath = path.resolve("transcribed_docs");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Write the transcribed text to a file
    const filePath = path.join(folderPath, "transcribed_text.txt");
    fs.writeFileSync(filePath, text);

    console.log(`✅ Transcribed text saved in: ${filePath}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

transcribeAudio();
