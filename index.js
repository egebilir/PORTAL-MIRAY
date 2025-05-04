require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// Admin authentication
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user || !await bcrypt.compare(password, user.password_hash)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 
            process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Survey submission
app.post('/api/survey', async (req, res) => {
    const surveyData = req.body;
    
    try {
        const result = await db.query(`
            INSERT INTO survey_responses (
                full_name, cabin_number, email, first_cruise,
                booking_rating, checkin_rating, cabin_rating,
                public_areas_rating, fb_rating, buffet_rating,
                general_service_rating, excursions_rating,
                price_rating, recommend_rating, bars_rating,
                restaurant_rating, entertainment_rating,
                shows_rating, music_rating, kids_rating,
                casino_rating, spa_rating, internet_rating,
                port_rating, reception_rating, guide_rating,
                dutyfree_rating, housekeeping_rating
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
            RETURNING id
        `, [
            surveyData.fullName, surveyData.cabinNumber, surveyData.email,
            surveyData.firstCruise === 'yes', surveyData.booking,
            surveyData.checkin, surveyData.cabin, surveyData.public,
            surveyData.fb, surveyData.buffet, surveyData.general,
            surveyData.excursions, surveyData.price, surveyData.recommend,
            surveyData.bars, surveyData.restaurant, surveyData.entertainment,
            surveyData.shows, surveyData.music, surveyData.kids,
            surveyData.casino, surveyData.spa, surveyData.internet,
            surveyData.port, surveyData.reception, surveyData.guide,
            surveyData.dutyfree, surveyData.housekeeping
        ]);

        res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// File upload
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const result = await db.query(`
            INSERT INTO media (filename, original_filename, mime_type, size, path, uploaded_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `, [
            req.file.filename,
            req.file.originalname,
            req.file.mimetype,
            req.file.size,
            req.file.path,
            req.user.id
        ]);

        res.json({
            success: true,
            file: {
                id: result.rows[0].id,
                filename: req.file.filename,
                path: req.file.path
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get survey responses (admin only)
app.get('/api/surveys', authenticateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM survey_responses ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update content
app.put('/api/content/:key', authenticateToken, async (req, res) => {
    const { key } = req.params;
    const { value, type } = req.body;

    try {
        const result = await db.query(`
            INSERT INTO content (key, value, type, last_modified_by)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (key) DO UPDATE
            SET value = $2, type = $3, last_modified_by = $4, updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [key, value, type, req.user.id]);

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get content
app.get('/api/content/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const result = await db.query('SELECT * FROM content WHERE key = $1', [key]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 