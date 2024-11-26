// bannerModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
  bannerName:String,
  bannerImage: String,
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },  // Reference to Category
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },  // Reference to Supplier
});

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
