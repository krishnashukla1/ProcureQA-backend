const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  ProductName: {
    type: String,
    required: true,
  },
  ItemCode: {
    type: String,
    required: true,
    unique: true,
  },
  Category: {
    CategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    CategoryName: {
      type: String,
      required: true,
      ref: 'Category',

    },
  },
  SubCategory: {
    SubCategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    SubCategoryName: {
      type: String,
      required: true,
      ref: 'SubCategory',

    },
    CategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  Unit: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },

  // createdAt: {
  //   type: Date,
  //   default: Date.now, // Automatically set to the current date
  // },
  // updatedAt: {
  //   type: Date,
  //   default: Date.now, // Automatically set to the current date
  // }




}, { timestamps: true });




// Add a text index on the ProductName field for efficient searching
productSchema.index({ ProductName: 'text' });

// Add compound index for CategoryName
productSchema.index({ 'Category.CategoryName': 1 });

// Add a compound index for SubCategoryName
productSchema.index({ 'SubCategory.SubCategoryName': 1 });

// Add a compound index for supplier

productSchema.index({ 'supplierId.name': 'text' });
productSchema.index({ ProductName: 1, ItemCode: 1 });
productSchema.index({ ItemCode: 1 }, { unique: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);

