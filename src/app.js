const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');

const start = async () => {
  const port = 3000;

  const app = express();
  app.engine(
    'hbs',
    expressHbs({ layoutsDir: 'views/layouts', defaultLayout: 'main-layout', extname: 'hbs' })
  );
  // app.set('view engine', 'pug');
  app.set('view engine', 'hbs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(rootDir, '..', 'public')));

  app.use('/admin', adminData.routes);
  app.use(shopRoutes);

  app.use('/', (req, res) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
  });
  app.listen(port, () => {
    console.log(`Listening on port ${port}!!!!!!!!`);
  });
};

start();
