const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: [10, 'min 10'],
        maxlength: [300, 'max 300']
    },
    content: {
        type: String
    },
    tags: {
        type: [String]
    },
    published: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true, // автоматично створює поля createdAt та updatedAt
    optimisticConcurrency: true
});

const Element = mongoose.model('elements', elementSchema);

module.exports = Element;