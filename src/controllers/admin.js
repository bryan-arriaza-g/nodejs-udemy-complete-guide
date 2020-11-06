const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.isLoggedIn,
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product({ title, description, price, imageUrl, userId: req.user._id });
  product
    .save()
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
    Product.findById(productId)
      .then((product) => {
        if (!product) {
          res.redirect('/');
        } else {
          res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/add-product',
            editing: editMode,
            product,
            isAuthenticated: req.isLoggedIn,
          });
        }
      })
      .catch((err) => console.error(err));
  }
};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, description, price } = req.body;
  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
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
  Product.findByIdAndRemove(productId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.error(err));
};

exports.getProducts = (req, res) => {
  Product.find()
    .populate('userId')
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch(console.error);
};
