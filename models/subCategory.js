const mongoose = require('mongoose');

// Define the schema for SubCategory
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,  // Ensure subcategory names are unique
      trim: true,
      minlength: [2, 'Subcategory name must be at least 2 characters long'],
    },
    description: {
      type: String,
      required: false,  // Optional description for the subcategory
      trim: true,
    },
    categoryId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Reference to the Category model
      required: true,
    }],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

subCategorySchema.index({ name: 'text' });

subCategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

module.exports = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);
