// patient-app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const patientAuthRoutes = require('./routes/patientAuth');
const patientLogsRoutes = require('./routes/patientLogs');
const patientNotesRoutes = require('./routes/patientNotes');
const patientRemindersRoutes = require('./routes/patientReminders');
const patientFeedbackRoutes = require('./routes/patientFeedbackRoutes');
const announcementRoutes = require('./routes/patientAnnouncements');


dotenv.config(); // Load .env variables

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use('/api/patient', patientAuthRoutes);
app.use('/api/patient', patientLogsRoutes);
app.use('/api/patient', patientNotesRoutes);
app.use('/api/patient', patientRemindersRoutes);
app.use('/api/patient', patientFeedbackRoutes)
app.use('/api/patient/announcements', announcementRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('InsuLink Patient API is running.');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Patient backend running on port ${PORT}...`);
});
