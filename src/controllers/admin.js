const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  Product.create({ title, price, imageUrl, description })
    .then(() => {
      console.log('Created Product !!!');
      res.redirect('/admin/products');
    })
    .catch(console.error);
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect('/');
  } else {
    const { productId } = req.params;
    Product.findByPk(productId)
      .then((product) => {
        if (!product) {
          res.redirect('/');
        } else {
          res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/add-product',
            editing: editMode,
            product,
          });
        }
      })
      .catch((err) => console.error(err));
  }
};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, description, price } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.setDataValue('title', title);
      product.setDataValue('imageUrl', imageUrl);
      product.setDataValue('description', description);
      product.setDataValue('price', price);
      return product.save();
    })
    .then(() => {
      console.log('Updated Product !!!');
      res.redirect('/admin/products');
    })
    .catch((err) => console.error(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      console.log('Destroyed Product !!!');
      res.redirect('/admin/products');
    })
    .catch((err) => console.error(err));
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(console.error);
};
