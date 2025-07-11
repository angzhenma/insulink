require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// routes
const announcements = require('./routes/adminAnnouncements');
const feedbackTypes = require('./routes/adminFeedbackTypes');
const adminLogs = require('./routes/adminLogs');
const adminAuth = require('./routes/adminAuth');
const adminRequests = require('./routes/adminRequests');

app.use('/api/announcements', announcements);
app.use('/api/feedback-types', feedbackTypes);
app.use('/api/admin-logs', adminLogs);
app.use('/api/admin', adminAuth);
app.use('/api/admin', adminRequests);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Admin API running on http://localhost:${PORT}`));
