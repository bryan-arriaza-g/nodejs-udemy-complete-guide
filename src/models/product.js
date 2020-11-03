const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);

// const { ObjectId } = require('mongodb');
// const { getDB } = require('../util/database');

// class Product {
//   constructor(title, description, price, imageUrl, id, userId) {
//     this.title = title;
//     this.description = description;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this._id = id ? ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDB();
//     const dataId = this._id;
//     let dbOperation;
//     if (this._id) {
//       dbOperation = db.collection('products').updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOperation = db.collection('products').insertOne(this);
//     }
//     return dbOperation
//       .then(() => {
//         if (dataId) {
//           console.log('Updated Product !!!');
//         } else {
//           console.log('Created Product !!!');
//         }
//       })
//       .catch(console.error);
//   }

//   static fetchAll() {
//     const db = getDB();
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch(console.error);
//   }

//   static findById(prodId) {
//     const db = getDB();
//     return db
//       .collection('products')
//       .find({ _id: ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch(console.error);
//   }

//   static deleteById(prodId) {
//     const db = getDB();
//     return db
//       .collection('products')
//       .deleteOne({ _id: ObjectId(prodId) })
//       .then(() => {
//         console.log('Deleted Product !!!');
//       })
//       .catch(console.error);
//   }
// }

// module.exports = Product;
