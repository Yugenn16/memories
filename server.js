const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize data file
async function initDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify({ 
            memories: {}, 
            specialDates: {}, 
            counterOffset: { years: 0, months: 0, days: 0 },
            music: null, 
            musicName: null,
            mainPhoto: null
        }));
    }
}

// Get all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// Save memories
app.post('/api/memories', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        data.memories = req.body;
        await fs.writeFile(DATA_FILE, JSON.stringify(data));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save memories' });
    }
});

// Save special dates
app.post('/api/special-dates', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        data.specialDates = req.body;
        await fs.writeFile(DATA_FILE, JSON.stringify(data));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save special dates' });
    }
});

// Save counter offset
app.post('/api/counter-offset', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        data.counterOffset = req.body;
        await fs.writeFile(DATA_FILE, JSON.stringify(data));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save counter offset' });
    }
});

// Save music
app.post('/api/music', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        data.music = req.body.music;
        data.musicName = req.body.musicName;
        await fs.writeFile(DATA_FILE, JSON.stringify(data));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save music' });
    }
});

// Save main photo
app.post('/api/main-photo', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        data.mainPhoto = req.body.mainPhoto;
        await fs.writeFile(DATA_FILE, JSON.stringify(data));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save main photo' });
    }
});

initDataFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
