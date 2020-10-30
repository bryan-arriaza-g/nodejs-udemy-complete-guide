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
}

module.exports = Product;
