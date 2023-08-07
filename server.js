const cors = require('cors');
const path = require('path');
const cronitor = require('cronitor')('bb06d5c8745f45f2a9fc62755b7414ea');
const createIndexs = require('./dbIndexes').createIndex
const express = require('express'),
  bodyParser = require('body-parser'),
  cron = require('node-cron'),
  mongoose = require('mongoose'),
  config = require('./config/db'),
  app = express(),
  server = require('http').Server(app),
  port = 9000;
app.use(cors({ origin: '*' }));

const userUtil = require('./app/lib/userUtil');

//mongoose.set('useCreateIndex', true) // to remove -> DeprecationWarning: collection.ensureIndex is deprecated. Use createIndex instead.

// mongoose instance connection url connection
if (mongoose.connection.readyState != 1) {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db, { useNewUrlParser: true, retryWrites: false, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.log(err)
  });

  db.once('open', function () {
    console.log('Database is connected');
  });
  module.exports = db;
}
mongoose.plugin((schema) => {
  schema.options.usePushEach = true;
});

//static files
app.use('/static', express.static(path.join(__dirname, 'uploads')));

// Bring in our dependencies
require('./config/express')(app, config);

server.listen(port, () => {
  console.log('We are live on port: ', port);
});

cronitor.wraps(cron);
cronitor.schedule('AccountBalanceClosingAndOpening', '55 23 * * *', async function () {
  console.log('Managing AccountBalance for every Accounting Accs!');
  const isLastDay = await userUtil.getLatestDay();
  if (isLastDay === true) {
    await userUtil.createAccountBalance();
    await userUtil.fixedAssetTransaction();
  } else {
    console.log('Today is not the right day for the scheduled task!');
  }
});

// cron.schedule('55 23 * * *', () => {
//   (async () => {
//     const isLastDay = await userUtil.getLatestDay();
//     if (isLastDay === true) {
//       await userUtil.createAccountBalance();
//     } else {
//       console.log('Today is not the right day for the scheduled task!');
//     }
//   })();
// });

