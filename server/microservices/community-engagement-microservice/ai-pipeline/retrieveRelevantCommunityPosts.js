const { JSONLoader } = require("@langchain/classic/document_loaders/fs/json");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { MemoryVectorStore } = require("@langchain/classic/vectorstores/memory");
const mongoose = require('mongoose');
const CommunityPost = require('../models/communityPost');

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { Comm_MONGODB_URL, GEMINI_API_KEY } = process.env;

const retrieveRelevantCommunityPosts = async (query) => {
    try {
        mongoose.connect(Comm_MONGODB_URL);

        console.log(`Connected to MongoDB at ${Comm_MONGODB_URL}`);

        // Get all community posts
        const doc = await CommunityPost.find();

        // Save posts to a temporary text file for loading into LangChain
        const tempFilePath = 'temp_community_posts.json';
        const fs = require('fs');
        const postsText = doc.map(post => {
            return {
                post: JSON.stringify(post.toJSON())
            }
        });
        fs.writeFileSync(tempFilePath, JSON.stringify(postsText));

        // Use JSONLoader to load the community posts into langchain and split into chunks
        const loader = new JSONLoader('temp_community_posts.json', '/post');
        const documents = await loader.load();

        // Do the embeddings and set up the vector store
        const embeddings = new GoogleGenerativeAIEmbeddings({
            model: "gemini-embedding-001",
            apiKey: GEMINI_API_KEY
        });

        const vectorStore = new MemoryVectorStore(embeddings);

        // Load Langchain documents into vector store
        await vectorStore.addDocuments(documents);
        
        // Using vector store, retrieve three relevant posts based on the query
        const relevantPosts = await vectorStore.similaritySearch(query, 3);

        // Return the relevant posts
        const relevantPostObjects = await Promise.all(relevantPosts.map(async (post) => {
            const postContent = JSON.parse(post.pageContent);
            const relevantPost = await CommunityPost.findById(postContent._id);
            return relevantPost;
        }));

        return relevantPostObjects;

    } catch (error) {
        console.error("Error retrieving relevant community posts:", error);
    }
}

module.exports = retrieveRelevantCommunityPosts;