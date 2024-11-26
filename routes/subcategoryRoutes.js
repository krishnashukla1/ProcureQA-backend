const express = require('express');
const { addSubcategory, getSubcategoriesByCategory, deleteSubcategory,getAllSubcategories,updateSubcategory } = require('../controllers/subcategoryController');

const router = express.Router();


// Add a subcategory under a category
router.post('/categories/:categoryId/subcategories', addSubcategory);

// Get all subcategories for a specific category
router.get('/categories/:categoryId/subcategories', getSubcategoriesByCategory);

// Delete a subcategory by ID
router.delete('/subcategories/:subcategoryId', deleteSubcategory);

// Update a subcategory by ID
router.put('/subcategories/:subcategoryId', updateSubcategory);

// Route to get all subcategories from the database
router.get('/subcategories', getAllSubcategories);

module.exports = router;
