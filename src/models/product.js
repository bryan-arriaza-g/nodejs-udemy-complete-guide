const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const pathDir = path.join(rootDir, 'data', 'products.json');

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    fs.readFile(pathDir, (err, data) => {
      let products = [];
      if (!err) {
        products = JSON.parse(data);
      }
      products.push(this);
      fs.writeFileSync(pathDir, JSON.stringify(products), (errWrite) => {
        console.error(errWrite);
      });
    });
  }

  static fetchAll(cb) {
    fs.readFile(pathDir, (err, data) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(data));
    });
  }
};
