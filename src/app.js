const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');
// Utils
const rootDir = require('./util/path');
// const User = require('./models/user');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const start = async () => {
  const port = 3000;
  const MONGODB_URI =
    'mongodb+srv://barriaza:34FtAsSQr3cv@cluster-east.coyk6.mongodb.net/node-complete-guide-shop';

  const app = express();
  const sessionStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
  });

  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(rootDir, '..', 'public')));

  app.use(
    session({
      secret: 'ZKZ9Dl5ZxvErAy5I6QiFEL$t&D$0u5Bk&W4f5EZehdt3hha%a&n2hRP2rNCe1yCr',
      resave: false, // No save the session by each request
      saveUninitialized: false, // If not neccesary store because no change nothing
      store: sessionStore,
    })
  );

  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  });

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);
  app.use(authRoutes);

  app.use('/', errorController.get404);

  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      app.listen(port, () => {
        console.log(`Listening on port ${port}!!!!!!!!`);
      });
    })
    .catch(console.error);
};

start();
