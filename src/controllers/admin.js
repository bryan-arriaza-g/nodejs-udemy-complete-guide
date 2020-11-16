const { validationResult } = require('express-validator/check');
const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  const product = new Product({
    title,
    description,
    price,
    imageUrl,
    userId: req.user,
  });
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
            hasError: false,
            product,
            errorMessage: null,
            validationErrors: [],
          });
        }
      })
      .catch((err) => console.error(err));
  }
};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, description, price } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: {
        _id: productId,
        title,
        imageUrl,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      return product.save().then(() => {
        console.log('Updated Product !!!');
        res.redirect('/admin/products');
      });
    })
    .catch((err) => console.error(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.error(err));
};

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .populate('userId')
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch(console.error);
};
