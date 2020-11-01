const { ObjectId } = require('mongodb');
const { getDB } = require('../util/database');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? ObjectId(id) : null;
  }

  save() {
    const db = getDB();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }
    const updatedCart = { items: updatedCartItems };
    const db = getDB();
    return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const db = getDB();
    return db.collection('users').findOne({ _id: ObjectId(userId) });
  }

  getCart() {
    const db = getDB();
    const productIds = this.cart.items.map((item) => item.productId);
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => {
              return item.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      })
      .catch(console.error);
  }
}

module.exports = User;
