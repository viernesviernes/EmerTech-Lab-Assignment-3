const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const CommunityPost = require('./models/communityPost');
const { getAllUserInteractions, saveInteraction } = require('./services/interactionRecorderService');
const GenerateGemeniApiResponse = require('./services/gemeniApiService');
const retrieveRelevantCommunityPosts = require('./ai-pipeline/retrieveRelevantCommunityPosts');

const MONGODB_URL = process.env.Comm_MONGODB_URL;
const TEST_USER_ID = '69bd968b6de193142473de6d';

async function connectDb() {
    await mongoose.connect(MONGODB_URL);
    console.log('test.js connected to MongoDB');
}

async function start() {
    if (!MONGODB_URL) {
        console.error('Comm_MONGODB_URL is not set');
        process.exit(1);
    }
    await connectDb();

    const app = express();
    const port = Number(process.env.TEST_REST_PORT) || 3005;

    app.use(cors());
    app.use(express.json());

    app.get('/interactions', async (req, res) => {
        try {
            const userId = req.query.userId || TEST_USER_ID;
            if (!userId) {
                return res.status(400).json({
                    error: 'Pass userId as query (?userId=...) or set TEST_USER_ID in .env',
                });
            }
            const list = await getAllUserInteractions(userId);
            res.json(list);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/ai', async (req, res) => {
        try {
            const { userMsg } = req.body || {};
            if (!userMsg || typeof userMsg !== 'string') {
                return res.status(400).json({ error: 'Body must include userMsg (string)' });
            }
            if (!TEST_USER_ID) {
                return res.status(400).json({
                    error: 'Set TEST_USER_ID in .env so past interactions can be loaded',
                });
            }

            const allPosts = await retrieveRelevantCommunityPosts(userMsg);
            const pastInteractions = await getAllUserInteractions(TEST_USER_ID);

            const aiResponse = await GenerateGemeniApiResponse(
                allPosts,
                pastInteractions,
                userMsg
            );

            await saveInteraction(TEST_USER_ID, userMsg, aiResponse);

            res.json(aiResponse);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    app.listen(port, () => {
        console.log(`Community engagement test REST API http://localhost:${port}`);
        console.log('  GET  /interactions?userId=...');
        console.log('  POST /ai  { "userMsg": "..." }  (needs TEST_USER_ID)');
    });
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
