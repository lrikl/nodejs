const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    brand: {
        type: String,
        minlength: [2, 'min 2 symbols'],
        maxlength: [20, 'max 20 symbols'],
        trim: true
    },
    model: {
        type: String
    },
    year: {
        type: Number,
        min: [1980, 'min 1980 year'],
        max: [2026, 'max 2026 year']
    },
    color: {
        type: String
    },
    price: {
        type: Number,
        min: [0, 'cannot be negative']
    },
    vin: {
        type: String,
        uppercase: true,
        match: [/^[A-HJ-NPR-Z0-9]{17}$/, 'invalid vin code format']
    }
}, {
    timestamps: true,
    optimisticConcurrency: true
});

const Element = mongoose.model('elements', elementSchema);

module.exports = Element;