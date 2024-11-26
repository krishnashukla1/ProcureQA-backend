const mongoose = require('mongoose');

// Define the schema for Category
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,  // Ensure category names are unique
      trim: true,
      minlength: [3, 'Category name must be at least 3 characters long'],
    
    },
    description: {
      type: String,
      required: false,  // Optional description for the category
      trim: true,
    },
    categoryImagePath:{
      type:String,
      required:false,
      default: null,
    },
    subCategoryId: [{
      type: mongoose.Schema.Types.ObjectId,
      // type: [String],
      ref: 'subCategory',  
    }],
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier', // Reference the Supplier model
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

categorySchema.index({ name: 'text' });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
