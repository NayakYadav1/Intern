const { loadAndSplitPDF } = require("../models/pdfModel");
const { initializeLLM, createVectorStore } = require("../models/llmModel");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

async function answerQuestion(req, res) {
  try {
    const splits = await loadAndSplitPDF();
    const vectorstore = await createVectorStore(splits);
    const retriever = vectorstore.asRetriever();

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

    const llm = initializeLLM();
    const questionAnswerChain = await createStuffDocumentsChain({ llm, prompt });
    const ragChain = await createRetrievalChain({
      retriever,
      combineDocsChain: questionAnswerChain,
    });

    const results = await ragChain.invoke({
      input: req.query.question || "What was Nike's revenue in 2023?",
    });

    res.send(results);
  } catch (err) {
    res.status(500).send({ error: "Error processing question", details: err.message });
  }
}

module.exports = { answerQuestion };