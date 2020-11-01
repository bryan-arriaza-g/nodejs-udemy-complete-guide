const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.fetchAll()
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
  Product.findById(productId)
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
  Product.fetchAll()
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
    .then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products,
      });
    })
    .catch(console.error);
};

exports.postCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      req.user.addToCart(product);
      res.redirect('/cart');
    })
    .catch(console.error);
};

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  req.user
    .deleteItemFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.error(err));
};

exports.postOrder = (req, res) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => console.error(err));
};

// exports.getOrders = (req, res) => {
//   req.user
//     .getOrders({ include: ['products'] })
//     .then((orders) => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders,
//       });
//     })
//     .catch(() => console.log);
// };

// exports.getCheckout = (req, res) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout',
//   });
// };
