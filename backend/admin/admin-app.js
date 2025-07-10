//require('dotenv').config();
require('dotenv').config({ path: __dirname + '/.env' });
console.log("S3 Bucket Name:", process.env.S3_BUCKET_NAME);
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// routes
const resources = require('./routes/adminResources');
const announcements = require('./routes/adminAnnouncements');
const feedbackTypes = require('./routes/adminFeedbackTypes');
const adminLogs = require('./routes/adminLogs');
const adminAuth = require('./routes/adminAuth');
const adminRegisterRequests = require('./routes/adminRegisterRequests');

app.use('/api/resources', resources);
app.use('/api/announcements', announcements);
app.use('/api/feedback-types', feedbackTypes);
app.use('/api/admin-logs', adminLogs);
app.use('/api/admin', adminAuth);
app.use('/api/admin-register-requests', adminRegisterRequests);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Admin API running on http://localhost:${PORT}`));