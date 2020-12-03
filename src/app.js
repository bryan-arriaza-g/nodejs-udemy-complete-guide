const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

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
  const port = process.env.PORT || 3000;
  const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster-east.coyk6.mongodb.net/${process.env.MONGO_DBNAME}`;

  const app = express();
  const sessionStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
  });
  const csrfProtection = csrf();

  app.set('view engine', 'ejs');
  app.set('views', 'views');

  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, `${new Date().toISOString()}-${file.originalname}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
  app.use(express.static(path.join(rootDir, '..', 'public')));
  app.use('/images', express.static(path.join(rootDir, '..', 'images')));

  app.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false, // No save the session by each request
      saveUninitialized: false, // If not neccesary store because no change nothing
      store: sessionStore,
    })
  );
  app.use(csrfProtection);
  app.use(flash());

  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        next(new Error(err));
      });
  });

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);
  app.use(authRoutes);

  app.get('/500', errorController.get500);
  app.use(errorController.get404);

  app.use((error, req, res) => {
    res.status(500).render('500', {
      pageTitle: 'Error!',
      path: '/500',
      isAuthenticated: req.session.isLoggedIn,
    });
  });

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
