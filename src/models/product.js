const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const pathDir = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
  fs.readFile(pathDir, (err, data) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(data));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex((prod) => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFileSync(pathDir, JSON.stringify(updatedProducts), (errWrite) => {
          console.error(errWrite);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFileSync(pathDir, JSON.stringify(products), (errWrite) => {
          console.error(errWrite);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      cb(product);
    });
  }
};
