const { ObjectId } = require('mongodb');
const { getDB } = require('../util/database');

class Product {
  constructor(title, description, price, imageUrl, id) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this._id = ObjectId(id);
  }

  save() {
    const db = getDB();
    let dbOperation;
    if (this._id) {
      dbOperation = db.collection('products').updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperation = db.collection('products').insertOne(this);
    }
    return dbOperation.then().catch(console.error);
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch(console.error);
  }

  static findById(prodId) {
    const db = getDB();
    return db
      .collection('products')
      .find({ _id: ObjectId(prodId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch(console.error);
  }

  static deleteById(prodId) {
    const db = getDB();
    return db
      .collection('products')
      .deleteOne({ _id: ObjectId(prodId) })
      .then(() => {
        console.log('Deleted');
      })
      .catch(console.error);
  }
}

module.exports = Product;
