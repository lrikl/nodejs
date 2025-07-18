const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    birthDate: {
        type: String,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'invalid date format. use "PPPP-MM-DD"']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'invalid email format']
    },
    phone: {
        type: String,
        unique: true,
        match: [/^\+\d{12}$/, 'invalid phone format. use "+ and 12 digits"']
    }
}, {
    timestamps: true,
    optimisticConcurrency: true
});

const Element = mongoose.model('elements', elementSchema);

module.exports = Element;