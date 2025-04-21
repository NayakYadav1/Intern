// const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
// const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

// const PdfPath = "E:/Downloads/nke-10k-2023.pdf";
// const loader = new PDFLoader(PdfPath);

// async function loadAndSplitPDF() {
//   const docs = await loader.load();
//   const textSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//     chunkOverlap: 200,
//   });
//   const splits = await textSplitter.splitDocuments(docs);
//   return splits;
// }

// module.exports = { loadAndSplitPDF };

const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");

const PdfPath = "E:/Downloads/nke-10k-2023.pdf";
const loader = new PDFLoader(PdfPath);

async function loadAndSplitPDF() {
  const docs = await loader.load();

  // Fallback manual text splitter
  const splits = docs.map((doc) => {
    const chunks = [];
    const chunkSize = 1000;
    const chunkOverlap = 200;
    for (let i = 0; i < doc.pageContent.length; i += chunkSize - chunkOverlap) {
      chunks.push({
        pageContent: doc.pageContent.slice(i, i + chunkSize),
        metadata: doc.metadata,
      });
    }
    return chunks;
  });

  return splits.flat();
}

module.exports = { loadAndSplitPDF };