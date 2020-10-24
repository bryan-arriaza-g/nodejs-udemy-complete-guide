const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const start = async () => {
  const port = 3000;

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(rootDir, '..', 'public')));

  app.use((req, res, next) => {
    User.findByPk(1)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch(console.error);
  });

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);

  app.use('/', errorController.get404);

  // Relations
  Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
  User.hasMany(Product);
  User.hasOne(Cart);
  Cart.belongsTo(User);
  Cart.belongsToMany(Product, { through: CartItem });
  Product.belongsToMany(Cart, { through: CartItem });
  Order.belongsTo(User);
  User.hasMany(Order);
  Order.belongsToMany(Product, { through: OrderItem });

  // Sequelize
  sequelize
    .sync()
    .then(() => {
      return User.findByPk(1);
    })
    .then((user) => {
      if (!user) {
        return User.create({ name: 'barriaza', email: 'bryan.arriaza.g@gmail.com' });
      }
      return user;
    })
    .then((user) => {
      return user.createCart();
    })
    .then(() => {
      app.listen(port, () => {
        console.log(`Listening on port ${port}!!!!!!!!`);
      });
    })
    .catch(console.error);
};

start();
