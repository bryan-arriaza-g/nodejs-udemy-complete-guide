const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(console.error);
};

exports.getProduct = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(console.error);
};

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(console.error);
};

exports.getCart = (req, res) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      return req.session.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(console.error);
};

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  req.session.user
    .removeFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.error(err));
};

exports.postOrder = (req, res) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });
      const order = new Order({
        products,
        user: {
          name: req.session.user.name,
          userId: req.session.user,
        },
      });
      return order.save();
    })
    .then(() => {
      return req.session.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.session.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(() => console.log);
};
