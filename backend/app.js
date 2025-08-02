// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/admin', require('./admin/routes/adminAuth'));
app.use('/api/admin/feedback-types', require('./admin/routes/adminFeedbackTypes'));
app.use('/api/admin/announcements', require('./admin/routes/adminAnnouncements'));
app.use('/api/admin/requests', require('./admin/routes/adminRequests'));

app.use('/api/coach', require('./coach/routes/coachAuth'));
app.use('/api/coach/logs', require('./coach/routes/logsRoutes'));
app.use('/api/coach/feedback', require('./coach/routes/feedbackRoutes'));
app.use('/api/coach/bookmarks', require('./coach/routes/bookmarksRoutes'));
app.use('/api/coach/notes', require('./coach/routes/notesRoutes'));
app.use('/api/coach/tags', require('./coach/routes/tagsRoutes'));
app.use('/api/coach/announcements', require('./coach/routes/coachAnnouncements'));

app.use('/api/patient', require('./patient/routes/patientAuth'));
app.use('/api/patient/logs', require('./patient/routes/patientLogs'));
app.use('/api/patient/notes', require('./patient/routes/patientNotes'));
app.use('/api/patient/reminders', require('./patient/routes/patientReminders'));
app.use('/api/patient/feedback', require('./patient/routes/patientFeedbackRoutes'));
app.use('/api/patient/announcements', require('./patient/routes/patientAnnouncements'));

app.get('/', (req, res) => {
  res.send('InsuLink unified backend is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Unified backend running on port ${PORT}`));
