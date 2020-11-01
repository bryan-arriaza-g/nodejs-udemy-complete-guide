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

// exports.getCart = (req, res) => {
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart
//         .getProducts()
//         .then((cartProducts) => {
//           res.render('shop/cart', {
//             path: '/cart',
//             pageTitle: 'Your Cart',
//             products: cartProducts,
//           });
//         })
//         .catch((err) => console.error(err));
//     })
//     .catch((err) => console.error(err));
// };

exports.postCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(console.error);

  //   let fetchedCart;
  //   let quantity = 1;
  //   req.user
  //     .getCart()
  //     .then((cart) => {
  //       fetchedCart = cart;
  //       return cart.getProducts({ where: { id: productId } });
  //     })
  //     .then((products) => {
  //       let product;
  //       if (products.length > 0) {
  //         const { 0: productInfo } = products;
  //         product = productInfo;
  //       }
  //       if (product) {
  //         const oldQuantity = product.cartItem.quantity;
  //         quantity = oldQuantity + 1;
  //         return product;
  //       }
  //       return Product.findByPk(productId);
  //     })
  //     .then((product) => {
  //       return fetchedCart.addProduct(product, { through: { quantity } });
  //     })
  //     .then(() => {
  //       res.redirect('/cart');
  //     })
  //     .catch((err) => console.error(err));
};

// exports.postCartDeleteProduct = (req, res) => {
//   const { productId } = req.body;
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       const product = products[0];
//       product.cartItem.destroy();
//     })
//     .then(() => {
//       res.redirect('/cart');
//     })
//     .catch((err) => console.error(err));
// };

// exports.postOrder = (req, res) => {
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           return order.addProduct(
//             products.map((productInfo) => {
//               const product = productInfo;
//               product.orderItem = { quantity: product.cartItem.quantity };
//               return product;
//             })
//           );
//         })
//         .catch((err) => console.error(err));
//     })
//     .then(() => {
//       fetchedCart.setProducts(null);
//     })
//     .then(() => {
//       res.redirect('/orders');
//     })
//     .catch((err) => console.error(err));
// };

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
