const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive amount']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Salary', 'Freelance', 'Investments', 'Business', 'Other']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Income', incomeSchema);
