const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthRoutes = require('./routes/health');
const summarizeRoutes = require('./routes/summarize');
const ocrRoutes = require('./routes/ocr');
const notesRoutes = require('./routes/notes');
const chatRoutes = require('./routes/chat');

const { notFound, errorHandler } = require('./middleware/error');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Routes
app.get('/api/health', healthRoutes.health);

app.post('/api/summarize/text', summarizeRoutes.textSummary);
app.post('/api/summarize/youtube', summarizeRoutes.youtubeSummary);

app.post('/api/ocr', ocrRoutes.ocr);
app.post('/api/notes/from-image', notesRoutes.fromImage);

app.post('/api/chat', chatRoutes.chat);

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

