const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(rootDir, '..', 'public')));

  app.use((req, res, next) => {
    User.findById('5fa36141fbf6dcbe9981fb2d')
      .then((user) => {
        req.user = user;
        next();
      })
      .catch(console.error);
  });

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);
  app.use(authRoutes);

  app.use('/', errorController.get404);

  mongoose
    .connect(
      'mongodb+srv://barriaza:34FtAsSQr3cv@cluster-east.coyk6.mongodb.net/node-complete-guide-shop?retryWrites=true&w=majority'
    )
    .then(() => {
      User.findOne().then((userData) => {
        if (!userData) {
          const user = new User({
            name: 'barriaza',
            email: 'bryan.arriaza.g@gmail.com',
            cart: {
              items: [],
            },
          });
          user.save();
        }
      });
      app.listen(port, () => {
        console.log(`Listening on port ${port}!!!!!!!!`);
      });
    })
    .catch(console.error);
};

start();
