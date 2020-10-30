const mongodb = require('mongodb');

const { MongoClient } = mongodb;
const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://barriaza:34FtAsSQr3cv@cluster-east.coyk6.mongodb.net/admin?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected !!!');
      callback(client);
    })
    .catch(console.error);
};

module.exports = mongoConnect;
