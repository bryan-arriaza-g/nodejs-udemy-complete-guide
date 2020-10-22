const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./util/database');
const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const start = async () => {
  const port = 3000;

  const app = express();

  db.execute('SELECT * FROM products')
    .then((result) => {
      console.log(result[0]);
    })
    .catch((err) => {
      console.error(err);
    });

  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(rootDir, '..', 'public')));

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);

  app.use('/', errorController.get404);
  app.listen(port, () => {
    console.log(`Listening on port ${port}!!!!!!!!`);
  });
};

start();
