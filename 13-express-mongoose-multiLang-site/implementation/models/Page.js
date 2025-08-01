const mongoose = require('mongoose');

const localSchema = new mongoose.Schema({
  ua: { type: String },
  fr: { type: String }
}, { _id: false });

const pageSchema = new mongoose.Schema({
  caption: {
    type: localSchema,
    required: true
  },
  text: {
    type: localSchema,
    required: true
  },
  image: {
    type: String
  }
}, {
  collection: 'page'
});

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
