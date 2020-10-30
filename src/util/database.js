const mongodb = require('mongodb');

const { MongoClient } = mongodb;
const mongoConnect = () => {
  MongoClient.connect(
    'mongodb+srv://barriaza:34FtAsSQr3cv@cluster-east.coyk6.mongodb.net/admin?retryWrites=true&w=majority'
  )
    .then(() => {
      console.log('Connected !!!');
    })
    .catch(console.error);
};

module.exports = mongoConnect;
