'use strict';

const path = require('path');

// Task 01 -----------
const readFile = require('./01');

readFile(path.join(__dirname, 'test.file'))
  .then(data => console.log(data))
  .catch(err => console.error(err));

// // Task 02 -----------
// const sumDat = require('./02');

// sumDat(path.join(__dirname, 'num.dat'))
//   .then(data => console.log(data))
//   .catch(err => console.error(err));

// // Task 03 -----------
// const writeInNewFile = require('./03');
// writeInNewFile('lololo');

// // Task 04 -----------
// const writeInNewFile = require('./04');
// writeInNewFile(['hi', 'bye', 'abc', 'ok']);

// // Task 05 -----------
// const copyFile = require('./05');
// copyFile(path.join(__dirname, 'test.file'), 'myfile.txt');


