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
const { errorHandler } = require('./middlewares/errorMiddleware');

// Validate Env Vars
if (!process.env.PORT || !process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('ERROR: Missing required environment variables (PORT, MONGO_URI, JWT_SECRET).');
    process.exit(1);
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
