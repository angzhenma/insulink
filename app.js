const express = require('express');
const app = express();
const port = 3000;

// ✅ Middleware to parse JSON body
app.use(express.json());

// ✅ Import auth middleware
const authenticate = require('./routes/coachAuth');

// ✅ Import route files
const logsRoutes = require('./routes/logsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const bookmarksRoutes = require('./routes/bookmarksRoutes');
const notesRoutes = require('./routes/notesRoutes');
const tagsRoutes = require('./routes/tagsRoutes');

// ✅ Protect routes with Cognito authentication
app.use('/logs', authenticate, logsRoutes);
app.use('/feedback', authenticate, feedbackRoutes);
app.use('/bookmarks', authenticate, bookmarksRoutes);
app.use('/notes', authenticate, notesRoutes);
app.use('/tags', authenticate, tagsRoutes);

// ✅ Open root route (optional)
app.get('/', (req, res) => {
    res.send('Hello from InsuLink Coach Backend!');
});

// ✅ Start server (use 0.0.0.0 for EC2)
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
