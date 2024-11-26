
// const mongoose = require('mongoose');


// const clientSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   companyName: {
//     type: String,
//     required: true,
//   },
//   phoneNo: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   productName:{
//     type:String
//   },
//   ItemCode:{
//     type:String,
//   },
//   subCategory:{
//     type:String,
//   },
//   supplier:{
//     type:String
//   }

// }, { timestamps: true });

// // const Client = mongoose.model('Client', clientSchema);

// module.exports = mongoose.models.Client || mongoose.model('Client', clientSchema);






const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to Product model
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory', // Reference to SubCategory model
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier', // Reference to Supplier model
    },
  },
  { timestamps: true }
);



// Virtual field for itemCode from the Product model
clientSchema.virtual('itemCode', {
  ref: 'Product', // Reference to Product model
  localField: 'product', // Field in Client schema
  foreignField: '_id', // Field in Product schema
  justOne: true, // Expect a single match
  select: 'ItemCode', // Retrieve only the ItemCode field
});

module.exports = mongoose.models.Client || mongoose.model('Client', clientSchema);

