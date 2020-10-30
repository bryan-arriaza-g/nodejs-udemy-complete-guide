const mongodb = require('mongodb');

let db;

const { MongoClient } = mongodb;
const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://barriaza:34FtAsSQr3cv@cluster-east.coyk6.mongodb.net/admin?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected !!!');
      db = client.db();
      callback();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

const getDB = () => {
  if (db) {
    return db;
  }
  throw String('No database found!');
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
