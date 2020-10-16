const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');

const start = async () => {
  const port = 3000;

  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(rootDir, '..', 'public')));

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);

  app.use('/', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'));
  });
  app.listen(port, () => {
    console.log(`Listening on port ${port}!!!!!!!!`);
  });
};

start();
