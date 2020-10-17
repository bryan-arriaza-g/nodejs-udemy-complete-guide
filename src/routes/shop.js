const express = require('express');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res) => {
  const { products } = adminData;
  res.render('shop', { prods: products, docTitle: 'Shop' });
});

module.exports = router;
