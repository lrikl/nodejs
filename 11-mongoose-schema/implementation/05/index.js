const mongoose = require('mongoose');
const Element = require('./elementSchema');

const mongoURL = 'mongodb://localhost:27017/storage';

const document = require('./document');
console.log(document);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('mongodb connected');
  }
  catch (err) {
    console.error('connection error', err);
    process.exit(1);
  }
}

const run = async () => {
  await connectDB();

  try {
    const model = new Element(document);
    await model.save();
    console.log(model);
  }
  catch (err) {
    console.error('save error', err);
  }
  finally {
    mongoose.disconnect();
  }
}

run();