const express = require('express');
const { addCategory, getCategories, getCategoryById,updateCategory,deleteCategory,createCategory, getAllCategories ,getQueryCategories } = require('../controllers/categoryController');




const router = express.Router();

// Route to add a new category
router.post('/categories', addCategory);

// Route to get all categories
router.get('/categories', getCategories);

// Route to get a category by ID
router.get('/categories/:id', getCategoryById);

router.put('/categories/:id', updateCategory);
router.delete('/categories/:Id', deleteCategory);

// Route to create a new category
router.post('/category', createCategory);


// router.post('/category', upload.single('categoryImagePath'), createCategory);  //WHEN NEED CATEGORYIMAGEPATH UPLOAD BY FORM-DATA THEN UNCOMMENT THIS LINE



router.get('/category', getAllCategories);


router.get('/search', getQueryCategories);






module.exports = router;
