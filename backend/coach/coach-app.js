require('dotenv').config({ path: '../.env' }); // Loading env variables
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Import middleware
const { verifyCoach } = require('./middleware/authMiddleware');

// Import route files
const logsRoutes = require('./routes/logsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const bookmarksRoutes = require('./routes/bookmarksRoutes');
const notesRoutes = require('./routes/notesRoutes');
const tagsRoutes = require('./routes/tagsRoutes');
const coachAnnouncementsRoutes = require('./routes/coachAnnouncements');

// Login & register route for coach
const coachAuthRoutes = require('./routes/coachAuth');
app.use('/api/coach', coachAuthRoutes);

// Protect routes JWT verifyCoach middleware
app.use('/api/logs', verifyCoach, logsRoutes);
app.use('/api/feedback', verifyCoach, feedbackRoutes);
app.use('/api/bookmarks', verifyCoach, bookmarksRoutes);
app.use('/api/notes', verifyCoach, notesRoutes);
app.use('/api/tags', verifyCoach, tagsRoutes);
app.use('/api/coach/announcements', verifyCoach, coachAnnouncementsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello from InsuLink Coach Backend!');
});

app.listen(PORT, '54.82.37.85', () => {
  console.log(`Coach API running on http://54.82.37.85:${PORT}`);
});
