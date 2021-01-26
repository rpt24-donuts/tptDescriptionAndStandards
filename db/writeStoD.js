const fs = require('fs');
const csvWriter = require('csv-write-stream');
const generator = require('./dataGenerator.js');

const standards = generator.standardGenerator();

const writer = csvWriter();

// const standardsToDescriptionsGen = () => {
//   let done = false;
//   writer.pipe(fs.createWriteStream('standardsToDescriptionsData.csv'));
//   for (let i = 0; i < 100; i += 1) {
//     const rand = Math.floor(Math.random() * 4);
//     const randomStandard = Math.floor(Math.random() * standards.length);

//     for (let j = 0; j < rand; j += 1) {
//       writer.write({
//         Product_id: i,
//         Standards_id: randomStandard + j,
//       });
//     }
//   }
//   writer.end();
//   done = true;
//   return done;
// };

const writeUsers = fs.createWriteStream('joins.csv');
writeUsers.write('Product_id,Standards_id\n', 'utf8');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function writeTenMillionUsers(writer, encoding, callback) {
  let i = 10000000;
  function write() {
    let ok = true;
    do {
      i -= 1;
      const Product_id = i;
      const Standards_id = getRandomInt(standards.length - 1);
      const data = `${Product_id},${Standards_id}\n`;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
  }
  write();
}

writeTenMillionUsers(writeUsers, 'utf-8', () => {
  writeUsers.end();
});