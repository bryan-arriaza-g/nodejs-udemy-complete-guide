const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// const User = require('./models/user');
// Utils
const rootDir = require('./util/path');
const { mongoConnect } = require('./util/database');
const User = require('./models/user');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const start = async () => {
  const port = 3000;

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(rootDir, '..', 'public')));

  app.use((req, res, next) => {
    User.findById('5f9e0c3a7d18b840d9bee681')
      .then((user) => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
      })
      .catch(console.error);
  });

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);

  app.use('/', errorController.get404);

  mongoConnect(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}!!!!!!!!`);
    });
  });
};

start();
