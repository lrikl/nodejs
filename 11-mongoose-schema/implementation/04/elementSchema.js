const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    name: {
        type: String
    },
    color: {
        type: String
    },
    heightCm: {
        type: Number,
        min: [0, 'min 0'],
        max: [100, 'max 100']
    },
    powerW: {
        type: Number,
        min: [0, 'min 0'],
        max: [100, 'max 100']
    },
    bulbType: {
        type: String,
        enum: {
            values: ['E27', 'E14', 'G4', 'G9'],
            message: 'Allowed values: E27, E14, G4, G9.'
        }
    },
    dimmable: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    optimisticConcurrency: true
});

const Element = mongoose.model('elements', elementSchema);

module.exports = Element;