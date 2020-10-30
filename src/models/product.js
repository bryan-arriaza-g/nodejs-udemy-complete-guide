const { ObjectId } = require('mongodb');
const { getDB } = require('../util/database');

class Product {
  constructor(title, description, price, imageUrl) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDB();
    return db.collection('products').insertOne(this).then(console.log).catch(console.error);
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
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
        console.log(product);
        return product;
      })
      .catch(console.error);
  }
}

module.exports = Product;
