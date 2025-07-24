const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: {
    type: String,
    trim: true,
    required: [true, 'Текстове поле треба заповнити'],
    minlength: [5, 'Коментар має містити щонайменше 5 символів']
  },
  visible: {
    type: Boolean,
    default: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  }
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;