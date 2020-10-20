const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const pathDir = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  constructor() {
    this.products = [];
    this.totalPrice = 0;
    this.quantity = 0;
  }

  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(pathDir, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(data);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(pathDir, JSON.stringify(cart), (errWrite) => {
        console.log(errWrite);
      });
    });
  }

  static deleteProduct(productId, productPrice) {
    fs.readFile(pathDir, (err, data) => {
      if (!err) {
        const updatedCart = { ...JSON.parse(data) };
        const product = updatedCart.products.find((prod) => prod.id === productId);
        if (!product) {
          return;
        }
        const productQuantity = product.quantity;
        updatedCart.products = updatedCart.products.filter((prod) => prod.id !== productId);
        updatedCart.totalPrice -= productPrice * productQuantity;
        fs.writeFile(pathDir, JSON.stringify(updatedCart), (errWrite) => {
          console.log(errWrite);
        });
      }
    });
  }

  static getCart(cb) {
    fs.readFile(pathDir, (err, data) => {
      const cart = JSON.parse(data);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
