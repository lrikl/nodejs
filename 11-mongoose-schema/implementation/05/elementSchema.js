const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    title: {
        type: String
    },
    author: {
        type: String,
        match: [/\S\s+\S/, 'there must be 1 space']
    },
    year: {
        type: Number,
        min: [1700, 'min 1700 year'],
        max: [2026, 'max 2026 year']
    }
}, {
    timestamps: true,
    optimisticConcurrency: true
});

const Element = mongoose.model('elements', elementSchema);

module.exports = Element;