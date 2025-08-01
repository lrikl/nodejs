// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Заголовок статті є обов\'язковим.'],
    trim: true,
    minlength: [5, 'Заголовок має містити щонайменше 5 символів'],
    maxlength: [100, 'Заголовок не може перевищувати 100 символів']
  },
  url: {
    type: String,
    required: [true, 'URL є обов\'язковим.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'URL може містити лише малі латинські літери, цифри та дефіси']
  },
  content: {
    type: String,
    required: [true, 'Вміст статті є обов\'язковим'],
    minlength: [20, 'Стаття має містити щонайменше 20 символів']
  },
  published: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
}, {
  timestamps: true
});

// для видалення коментарів з видаленної статі
articleSchema.pre('deleteOne', async function(next) {
  try {
    // 'this' це об'єкт запиту (query) отримуємо ID статті з фільтра запиту
    const articleId = this.getFilter()['_id'];
    console.log('Видалення коментарів для статті:', articleId);

    // отримуємо модель Comment через модель Article
    const Comment = this.model.model('Comment');
    
    // видаляємо всі коментарі, що посилаються на цей articleId
    await Comment.deleteMany({ article: articleId });
    
    next();
  } catch (err) {
    next(err);
  }
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;