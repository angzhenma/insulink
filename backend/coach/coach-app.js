const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// ✅ Import middleware correctly
const { verifyCoach } = require('./middleware/authMiddleware');

// ✅ Import route files
const logsRoutes = require('./routes/logsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const bookmarksRoutes = require('./routes/bookmarksRoutes');
const notesRoutes = require('./routes/notesRoutes');
const tagsRoutes = require('./routes/tagsRoutes');

// ✅ Login route for coach (use router directly)
const coachAuthRoutes = require('./routes/coachAuth');
app.use('/coach', coachAuthRoutes);

// ✅ Protect routes with JWT verifyCoach middleware
app.use('/logs', verifyCoach, logsRoutes);
app.use('/feedback', verifyCoach, feedbackRoutes);
app.use('/bookmarks', verifyCoach, bookmarksRoutes);
app.use('/notes', verifyCoach, notesRoutes);
app.use('/tags', verifyCoach, tagsRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Hello from InsuLink Coach Backend!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
