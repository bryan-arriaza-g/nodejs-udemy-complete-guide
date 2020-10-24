const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch(console.error);
};

exports.getProduct = (req, res) => {
  const { productId } = req.params;
  // By PK ID
  Product.findByPk(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(console.error);
};

exports.getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(console.error);
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((cartProducts) => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts,
          });
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};

exports.postCart = (req, res) => {
  const { productId } = req.body;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(() => {
      /* let product;
      if (products.length > 0) {
        product = products[0];
      } */
      const quantity = 1;
      /* if (product) {} */
      return Product.findByPk(productId)
        .then((productData) => {
          return fetchedCart.addProduct(productData, { through: { quantity } });
        })
        .catch((err) => console.error(err));
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.error(err));
};

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then(([product]) => {
      Cart.deleteProduct(productId, product.price);
      res.redirect('/cart');
    })
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
