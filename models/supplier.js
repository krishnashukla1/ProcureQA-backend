/*
const mongoose = require('mongoose');
const validator = require('validator');

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      minlength: [3, 'Supplier name must be at least 3 characters long'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Please provide a valid email address',
      },
    },
    companyName:{
      type: String,
      required: [true, 'Company name is required'],
      minlength: [2, 'Company name must be at least 2 characters long'],
      trim: true,
    },
    companyType:{
      type: String,
      required: false
    },
    companyLogo:{
      type: String,
      required: false
    },
    officeAddress: {
      type: String,
      required: [true, 'Office address is required'],
      minlength: [10, 'Office address must be at least 10 characters long'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      validate: {
        validator: (value) => /^\d{3} \d{8}$/.test(value),
        message: 'Contact number must be in the format: XXX XXXXXXXXX (e.g., 974 55568329)',
      },
    },
    // Categories as ObjectId references to the Category model
    productCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      // type: [String],
      ref: 'Category',   // Reference to the Category model
      required: [false, 'Product categories are required'],
    }],
    
    // Subcategories as ObjectId references to the SubCategory model
    productSubCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      // type: [String],
      ref: 'SubCategory',  // Reference to the SubCategory model
      required: [false, 'Product subcategories are required'],
    }],
    
    // Products as ObjectId references to the Product model
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      // type: [String],
      ref: 'Product',  // Reference to the Product model
    }],
  },


  {
    timestamps: {
      currentTime: () => new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000),
    },
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

  // Create a text index on the 'name' field
  supplierSchema.index({ name: 'text' }),
  
module.exports = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);

*/



// const mongoose = require('mongoose');
// const validator = require('validator');

// const supplierSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Supplier name is required'],
//       minlength: [3, 'Supplier name must be at least 3 characters long'],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, 'Email address is required'],
//       unique: true,
//       lowercase: true,
//       validate: {
//         validator: (value) => validator.isEmail(value),
//         message: 'Please provide a valid email address',
//       },
//     },
//     companyName: {
//       type: String,
//       required: [true, 'Company name is required'],
//       minlength: [2, 'Company name must be at least 2 characters long'],
//       trim: true,
//     },
//     companyType: {
//       type: String,
//       required:false

//       // default: 'Not Specified', // Optional field with default value
//     },
//     companyLogo: {
//       type: String,
//       required:false
//       // default: 'default_logo.png', // Optional field with default value
//     },

  

//     officeAddress: {
//       type: String,
//       required: [true, 'Office address is required'],
//       minlength: [10, 'Office address must be at least 10 characters long'],
//       trim: true,
//     },
//     contactNumber: {
//       type: String,
//       required: [true, 'Contact number is required'],
//       validate: {
//         validator: (value) => /^\d{3} \d{8}$/.test(value),
//         message: 'Contact number must be in the format: XXX XXXXXXXXX (e.g., 974 55568329)',
//       },
//     },
//     // Categories as ObjectId references to the Category model
//     productCategories: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Category',
//     }],
    
//     // Subcategories as ObjectId references to the SubCategory model
//     productSubCategories: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'SubCategory',
//     }],
    
//     // Products as ObjectId references to the Product model
//     products: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//     }],
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt
//     toJSON: { getters: true },
//     toObject: { getters: true },
//   }
// );

// // Create a text index on the 'name' field
// supplierSchema.index({ name: 'text' });

// module.exports = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);



const mongoose = require('mongoose');
const validator = require('validator');
const supplierSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Supplier name is required'],
      minlength: [3, 'firstName  must be at least 3 characters long'],
      trim: true,
    },

    lastName: {
      type: String,
      required: false,
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Please provide a valid email address',
      },
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      minlength: [2, 'Company name must be at least 2 characters long'],
      trim: true,
    },
    companyType: {
      type: String,
      // required: [true, 'Company type is required'], // companyType is now required
    },
    companyLogo: {
      type: String,
      // required: [true, 'Company logo is required'], // companyLogo is now required
      default: 'http://192.168.1.202:5000/images/cmpLogo/cmpLogo.png',
  
    },
    officeAddress: {
      type: String,
      required: [false, 'Office address is required'],

      // required: [true, 'Office address is required'],
      minlength: [10, 'Office address must be at least 10 characters long'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      validate: {
        validator: (value) => /^\d{3} \d{8}$/.test(value),
        message: 'Contact number must be in the format: XXX XXXXXXXXX (e.g., 974 55568329)',
      },
    },
    // Categories as ObjectId references to the Category model
    productCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    
    // Subcategories as ObjectId references to the SubCategory model
    productSubCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    }],
    
    // Products as ObjectId references to the Product model
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Create a text index on the 'name' field
supplierSchema.index({ name: 'text' });

module.exports = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);




