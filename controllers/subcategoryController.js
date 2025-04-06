const Category = require('../models/category'); // Import Category model
const SubCategory = require('../models/subCategory'); // Import SubCategory model

// Add a subcategory under a category
const addSubcategory = async (req, res) => {
    const { categoryId } = req.params; // Get categoryId from URL params
    const { name, description } = req.body; // Get subcategory name and description from body

    try {
        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if the subcategory name is unique within the selected category
        const existingSubcategory = await SubCategory.findOne({
            name: name.trim(),
            categoryId: categoryId
        });
        if (existingSubcategory) {
            return res.status(400).json({ message: 'Subcategory already exists for this category' });
        }

        // Create the new subcategory
        const newSubcategory = new SubCategory({
            name: name.trim(),
            description: description.trim(),
            categoryId: categoryId
        });

        // Save the subcategory
        await newSubcategory.save();

        // Respond with the created subcategory
        res.status(201).json({
            message: 'Subcategory created successfully',
            subcategory: newSubcategory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Retrieve all subcategories for a specific category
const getSubcategoriesByCategory = async (req, res) => {
    const { categoryId } = req.params; // Get categoryId from URL params

    try {
        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Fetch subcategories associated with the category
        const subcategories = await SubCategory.find({ categoryId: categoryId });

        if (subcategories.length === 0) {
            return res.status(200).json([]); // Return an empty array if no subcategories found
        }

        res.status(200).json(subcategories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a subcategory by its ID
const deleteSubcategory = async (req, res) => {
    const { subcategoryId } = req.params; // Get subcategoryId from URL params

    try {
        // Check if the subcategory exists
        const subcategory = await SubCategory.findById(subcategoryId);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        // Delete the subcategory
        await SubCategory.findByIdAndDelete(subcategoryId);

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a subcategory by its ID
const updateSubcategory = async (req, res) => {
    const { subcategoryId } = req.params;
    const { name, description } = req.body;

    try {
        // Check if the subcategory exists
        const subcategory = await SubCategory.findById(subcategoryId);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        // Update the subcategory
        subcategory.name = name.trim();
        subcategory.description = description.trim();

        await subcategory.save();

        res.status(200).json({
            message: 'Subcategory updated successfully',
            subcategory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
// const getAllSubcategories = async (req, res) => {
//     try {
//         // Fetch all subcategories from the database
//         const subcategories = await SubCategory.find();

//         // If no subcategories exist, return an empty array
//         if (subcategories.length === 0) {
//             return res.status(200).json({ message: 'No subcategories found' });
//         }

//         // Return the list of subcategories
//         res.status(200).json(subcategories);
//     } catch (error) {
//         console.error('Error fetching subcategories:', error);
//         res.status(500).json({ error: 'Failed to retrieve subcategories' });
//     }
// };

const getAllSubcategories = async (req, res) => {
    try {
      // Get pagination parameters from query, with defaults
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
  
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;
  
      // Fetch subcategories with pagination
      const subcategories = await SubCategory.find()
        .skip(skip) // Skip records for pagination
        .limit(limit); // Limit the number of records per page
  
      // Get the total number of subcategories to calculate total pages
      const totalSubcategories = await SubCategory.countDocuments();
      const totalPages = Math.ceil(totalSubcategories / limit);
  
      // If no subcategories exist
      if (subcategories.length === 0) {
        return res.status(200).json({
          code: 200,
          error: false,
          message: 'No subcategories found',
          pagination: {
            totalElements: totalSubcategories,
            totalPages: totalPages,
            size: limit,
            pageNo: page,
            numberOfElements: subcategories.length
          },
          data: []
        });
      }
  
      // Return paginated response
      res.status(200).json({
        code: 200,
        error: false,
        message: 'Subcategories fetched successfully',
        pagination: {
          totalElements: totalSubcategories,
          totalPages: totalPages,
          size: limit,
          pageNo: page,
          numberOfElements: subcategories.length
        },
        data: {
          subcategories
        }
      });
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      res.status(500).json({
        code: 500,
        error: true,
        message: 'Failed to retrieve subcategories',
        pagination: null,
        data: null
      });
    }
  };
  




module.exports = {
    addSubcategory,
    getSubcategoriesByCategory,
    deleteSubcategory,
    updateSubcategory,getAllSubcategories
};


