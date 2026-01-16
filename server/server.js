const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/income', require('./routes/incomeRoutes'));
app.use('/expense', require('./routes/expenseRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes')); // Placeholder for dashboard routes

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
