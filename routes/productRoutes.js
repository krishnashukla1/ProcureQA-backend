// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Define routes for the product controller
router.post('/bulk-upload/:supplierId', upload.single('excelFile'), productController.uploadBulkProducts); // For bulk upload
router.post('/', productController.createProduct); // For creating a new product
router.put('/:id', productController.updateProduct); // For updating a product by ID
router.delete('/:id', productController.deleteProduct); // For deleting a product by ID
router.get('/', productController.getProducts); // For getting all products
router.get('/:id', productController.getProductById); // For getting a product by ID
// router.get('/name/:name', productController.getProductByName); 

// router.get('/', productController.getProductByName); 
router.get('/search/q', productController.getProductsByQuery);







router.get('/cat/categories', productController.getAllCategories);
router.get('/sub/subcategories', productController.getAllSubCategories);


// // Route for searching by Category Name
router.get('/category/:category', productController.getProductsByCategory);

// // Route for searching by Subcategory Name
router.get('/subcategory/:subcategory', productController.getProductsBySubcategory);


// router.get('/supplier/:supplierID', productController.getProductsBySupplierId);

module.exports = router;

