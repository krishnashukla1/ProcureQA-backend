// searchRoutes.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search2Controller');

// Global search route
router.get('/search', searchController.globalSearch);

// Product search routes
router.get('/products/search', searchController.getProductsByProductName);

router.get('/itemcode/search', searchController.getProductsByItemCode);

// Category search route
router.get('/category/search', searchController.getProductsByCategoryName);

// SubCategory search route

router.get('/subcategory/search', searchController.getProductsBySubCategoryName);

// Supplier search route
router.get('/suppliers/search', searchController.getProductsBySupplierName);





module.exports = router;
