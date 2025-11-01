require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('./middleware/rateLimit');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const mgnregaRoutes = require('./routes/mgnrega');

const app = express();

// Middleware
app.use(logger);
app.use(rateLimit);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '10kb' })); // Limit body size

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/mgnrega', mgnregaRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
