const Category = require('../models/category'); // Import the Category model

// Add a new category to the MongoDB database
const addCategory = async (req, res) => {
    const { name, description } = req.body;

    // Validate that the name is provided and non-empty
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        // Check if the category already exists (case insensitive)
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });

        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        // Create and save the new category to the database
        const newCategory = new Category({
            name: name.trim(),
            description: description ? description.trim() : '', // Optional description
        });

        await newCategory.save();

        // Respond with success message and the created category
        res.status(201).json({
            message: 'Category added successfully',
            category: newCategory,
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: 'Failed to add category' });
    }
};


// POST request handler to create a new category
// const createCategory = async (req, res) => {
//     try {
//       const { name, description, imagePath, subCategoryId, supplierId } = req.body;
  
//       // Create a new category instance
//       const newCategory = new Category({
//         name,
//         description,
//         imagePath,
//         subCategoryId,
//         supplierId,
//       });
  
//       // Save the category to the database
//       const savedCategory = await newCategory.save();
//       res.status(201).json(savedCategory); // Return the saved category
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error creating category', error: error.message });
//     }
//   };

// const categoryImagePath = "/images/Consumables.png"; // Relative to the public URL path


const createCategory = async (req, res) => {
    try {
      console.log(req.body); // Log the request body to see if the data is coming through
      const { name, description, categoryImagePath, subCategoryId, supplierId } = req.body;
  
      const newCategory = new Category({
        name,
        description,
        categoryImagePath,
        subCategoryId,
        supplierId,
      });
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } 
    
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  };

  
  
//------------------------UPLOAD IMAGE BY FORM-DATA------------
/*
const multer = require('multer');
const path = require('path');

// Server Base URL
const BASE_URL = "http://65.2.0.34:5000"; // Replace with your server's base URL

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/categoryImages'); // Directory for category images
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Unique file name to avoid conflicts
  },
});

// Initialize Multer
const upload = multer({ storage });

// Route Handler for Creating a Category
const createCategory = async (req, res) => {
  // Use multer to handle the file upload
  upload.single('categoryImage')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name, description, subCategoryId, supplierId } = req.body;

      // Ensure required fields are provided
      if (!name || !req.file || !subCategoryId || !supplierId) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      // Construct the full URL for the uploaded image
      const categoryImagePath = `${BASE_URL}/${req.file.path.replace(/\\/g, '/')}`;

      // Create a new category
      const newCategory = new Category({
        name,
        description,
        categoryImagePath,
        subCategoryId,
        supplierId,
      });

      const savedCategory = await newCategory.save();

      res.status(201).json({
        message: 'Category created successfully',
        category: savedCategory,
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  });
};
--------------in postman----------
name: Category Name
description: Category Description
subCategoryId: 12345
supplierId: 67890
categoryImage (file type): Select an image file from your system
*/
//-----------------------


  
  const getAllCategories = async (req, res) => {
    try {


        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

      const categories = await Category.find()
        // .select('name imagePath') // Only select name and imagePath fields
        .select('name categoryImagePath') // Only select name and imagePath fields

        // .populate('subCategoryId') // Optional, if you want to populate subCategories
        // .populate('supplierId');   // Optional, if you want to populate supplierId
        .skip(skip) // Skip documents
        .limit(limit); // Limit the number of documents
        const totalCategories = await Category.countDocuments();
        const totalPages = Math.ceil(totalCategories / limit);

        res.status(200).json({
            page,
            totalPages,
            totalCategories,
            categories,
          });

    //   res.status(200).json(categories); // Return the filtered categories
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  };
  














// Retrieve all categories from the MongoDB database
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Find all categories in the database
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
};



//http://localhost:5000/api/category/search?q=tape
const getQueryCategories = async (req, res) => {
        const { q } = req.query; // Extract the query parameter `q`
    
        try {
            // If `q` is provided, search for categories by name (case-insensitive)
            const regex = q ? new RegExp(q, 'i') : {}; // Use regex for case-insensitive search or empty object for no filter
    
            // Fetch categories, selecting only `name` and `categoryImagePath`
            const categories = await Category.find({ name: regex }).select('name categoryImagePath');
    
            if (categories.length === 0) {
                return res.status(404).json({ message: 'No categories found' });
            }
    
            res.status(200).json(categories); // Return the filtered categories
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Failed to retrieve categories' });
        }
    };
    





// Fetch a category by its ID from the MongoDB database
const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id); // Find the category by ID
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};
// Update an existing category by its ID
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        // Check if the category exists
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if another category already exists with the same name (case insensitive)
        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            _id: { $ne: id }, // Exclude the current category from the check
        });

        if (existingCategory) {
            return res.status(400).json({ error: 'Category with this name already exists' });
        }

        // Update the category's details
        category.name = name.trim();
        category.description = description ? description.trim() : '';

        // Save the updated category
        await category.save();

        // Respond with the updated category
        res.status(200).json({
            message: 'Category updated successfully',
            category,
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};
// Delete a subcategory by its ID
const deleteCategory = async (req, res) => {
    const { id } = req.params; // Get subcategoryId from URL params

    try {
        // Check if the subcategory exists
        // const subcategory = await SubCategory.findById(subcategoryId);
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete the subcategory
        await category.findByIdAndDelete(id);

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = {
    addCategory,
    getCategories,
    getCategoryById,updateCategory,deleteCategory,

    createCategory,getAllCategories,getQueryCategories
};

