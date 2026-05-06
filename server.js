require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// MongoDB Client
let db;
let dataCollection;

// Connect to MongoDB
async function connectDB() {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not defined in environment variables!');
        console.error('Please set MONGODB_URI in your .env file or Render environment variables.');
        process.exit(1);
    }
    
    try {
        const client = new MongoClient(MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        
        await client.connect();
        console.log('✅ Connected to MongoDB!');
        
        db = client.db('kimchiii-memories');
        dataCollection = db.collection('appData');
        
        // Initialize with default data if empty
        const count = await dataCollection.countDocuments();
        if (count === 0) {
            await dataCollection.insertOne({
                _id: 'app-data',
                memories: {},
                specialDates: {},
                counterOffset: { years: 0, months: 0, days: 0 },
                music: null,
                musicName: null,
                mainPhoto: null
            });
            console.log('✅ Initialized default data');
        }
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await dataCollection.findOne({ _id: 'app-data' });
        res.json(data || {
            memories: {},
            specialDates: {},
            counterOffset: { years: 0, months: 0, days: 0 },
            music: null,
            musicName: null,
            mainPhoto: null
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// Save memories
app.post('/api/memories', async (req, res) => {
    try {
        await dataCollection.updateOne(
            { _id: 'app-data' },
            { $set: { memories: req.body } },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving memories:', error);
        res.status(500).json({ error: 'Failed to save memories' });
    }
});

// Save special dates
app.post('/api/special-dates', async (req, res) => {
    try {
        await dataCollection.updateOne(
            { _id: 'app-data' },
            { $set: { specialDates: req.body } },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving special dates:', error);
        res.status(500).json({ error: 'Failed to save special dates' });
    }
});

// Save counter offset
app.post('/api/counter-offset', async (req, res) => {
    try {
        await dataCollection.updateOne(
            { _id: 'app-data' },
            { $set: { counterOffset: req.body } },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving counter offset:', error);
        res.status(500).json({ error: 'Failed to save counter offset' });
    }
});

// Save music
app.post('/api/music', async (req, res) => {
    try {
        await dataCollection.updateOne(
            { _id: 'app-data' },
            { $set: { music: req.body.music, musicName: req.body.musicName } },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving music:', error);
        res.status(500).json({ error: 'Failed to save music' });
    }
});

// Save main photo
app.post('/api/main-photo', async (req, res) => {
    try {
        await dataCollection.updateOne(
            { _id: 'app-data' },
            { $set: { mainPhoto: req.body.mainPhoto } },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving main photo:', error);
        res.status(500).json({ error: 'Failed to save main photo' });
    }
});

// Start server after DB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
