import vectorStore from "../weaviateDb/weaviateDb.js";


export const retrieve = async ({ query }) => {
    // console.log("Querying ChromaDB with:", query);
    const retrievedDocs = await vectorStore.similaritySearch(query, 20);
    // console.log("Retrieved Documents from ChromaDB:", retrievedDocs);

    const serializedDocs = retrievedDocs
        .map(
            (doc) => `source: ${doc.metadata.source}\ncontent: ${doc.pageContent}`
        )
        .join("\n");

    return [serializedDocs, retrievedDocs];
};