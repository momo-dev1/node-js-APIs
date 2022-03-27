const router = require('express').Router()
const { getAllProducts } = require('../controllers/products')



router.route('/').get(getAllProducts)

module.exports = router 