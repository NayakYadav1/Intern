// Imports
const express = require("express");
const dotenv = require("dotenv");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

// Environment Configuration
dotenv.config();

// Initialize Express App
const app = express();
const PORT = 3000;

// PDF Loader Configuration
const PdfPath = "E:/Downloads/nke-10k-2023.pdf";
const loader = new PDFLoader(PdfPath);

// LLM Configuration
try {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0,
  });
} catch (err) {
  console.error("Error initializing ChatGoogleGenerativeAI:", err.message);
}

// Endpoint to Load and Display PDF Content
app.get("/", async (req, res) => {
  try {
    const docs = await loader.load();
    console.log(`Number of documents: ${docs.length}`);
    console.log(`First 100 characters of content: ${docs[0].pageContent.slice(0, 100)}`);
    console.log(`Metadata:`, docs[0].metadata);
    res.send(docs[0].pageContent.slice(0, 500)); // Send the first 500 characters of the document
  } catch (err) {
    res.status(500).send({ error: "Error loading PDF", details: err.message });
  }
});

// Question and Answering with RAG (Retrieval-Augmented Generation)
app.get("/qa", async (req, res) => {

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-pro",
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0,
      });

  try {
    // Load and Split Documents
    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs);

    // Create Vector Store
    const vectorstore = await MemoryVectorStore.fromDocuments(
      splits,
      new GoogleGenerativeAIEmbeddings()
    );

    // Create Retriever
    const retriever = vectorstore.asRetriever();

    // Define Prompt Template
    const systemTemplate = [
      `You are an assistant for question-answering tasks. `,
      `Use the following pieces of retrieved context to answer `,
      `the question. If you don't know the answer, say that you `,
      `don't know. Use three sentences maximum and keep the `,
      `answer concise.`,
      `\n\n`,
      `{context}`,
    ].join("");

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["human", "{input}"],
    ]);

    // Create Chains
    const questionAnswerChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });
    const ragChain = await createRetrievalChain({
      retriever,
      combineDocsChain: questionAnswerChain,
    });

    // Invoke Chain with a Sample Question
    const results = await ragChain.invoke({
      input: "What was Nike's revenue in 2023?",
    });

    console.log(results);
    res.send(results); // Send the results to the browser
  } catch (err) {
    res.status(500).send({ error: "Error processing question", details: err.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});