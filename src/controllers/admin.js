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
      res.redirect('/admin/add-product');
    })
    .catch(console.error);
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect('/');
  } else {
    const { productId } = req.params;
    Product.findById(productId)
      .then(([product]) => {
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
  const updatedProduct = new Product(productId, title, imageUrl, description, price);
  updatedProduct
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.error(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};
