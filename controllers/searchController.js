/*
const Product = require('../models/product');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const Supplier = require('../models/supplier');

exports.searchAllTables = async (req, res) => {
  const searchTerm = req.params.term;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit) ;
  const skip = (page - 1) * limit;

  try {
    // Search in Products using `$text` operator
    const products = await Product.find({ $text: { $search: searchTerm } })
      .skip(skip)
      .limit(limit)
      .select('ProductName ItemCode') // Make sure to select 'ItemCode' here
      .populate({ path: 'Category.CategoryID', select: 'name' })
      .populate({ path: 'SubCategory.SubCategoryID', select: 'name' })
      .populate({ path: 'supplierId', select: 'name' });

    const totalProductCount = await Product.countDocuments({ $text: { $search: searchTerm } });
    const totalProductPages = Math.ceil(totalProductCount / limit);

    // Search in Categories using `$text` operator
    const categories = await Category.find({ $text: { $search: searchTerm } })
      .skip(skip)
      .limit(limit)
      .select('name');
    const totalCategoryCount = await Category.countDocuments({ $text: { $search: searchTerm } });
    const totalCategoryPages = Math.ceil(totalCategoryCount / limit);

    // Search in SubCategories using `$text` operator
    const subCategories = await SubCategory.find({ $text: { $search: searchTerm } })
      .skip(skip)
      .limit(limit)
      .select('name');
    const totalSubCategoryCount = await SubCategory.countDocuments({ $text: { $search: searchTerm } });
    const totalSubCategoryPages = Math.ceil(totalSubCategoryCount / limit);

    // Search in Suppliers using `$text` operator
    const suppliers = await Supplier.find({ $text: { $search: searchTerm } })
      .skip(skip)
      .limit(limit)
      .select('name');
    const totalSupplierCount = await Supplier.countDocuments({ $text: { $search: searchTerm } });
    const totalSupplierPages = Math.ceil(totalSupplierCount / limit);

    // Combine all results into a single response
    res.status(200).json({
      products: {
        currentPage: page,
        totalPages: totalProductPages,
        totalCount: totalProductCount,
        data: products.map(product => ({
          productName: product.ProductName,
          categoryName: product.Category?.name || '',
          subCategoryName: product.SubCategory?.name || '',
          supplierName: product.supplierId?.name || '',
          ItemCode: product.ItemCode // Ensure ItemCode is included here
        }))
      },
      categories: {
        currentPage: page,
        totalPages: totalCategoryPages,
        totalCount: totalCategoryCount,
        data: categories.map(category => category.name)
      },
      subCategories: {
        currentPage: page,
        totalPages: totalSubCategoryPages,
        totalCount: totalSubCategoryCount,
        data: subCategories.map(subCategory => subCategory.name)
      },
      suppliers: {
        currentPage: page,
        totalPages: totalSupplierPages,
        totalCount: totalSupplierCount,
        data: suppliers.map(supplier => supplier.name)
      }
    });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Error fetching search results' });
  }
};


*/

// searchController.js  //for 1 API
// exports.getAllDetails = async (req, res) => {
//   const { productId, supplierId, categoryId, subCategoryId } = req.query; // Get the IDs from the query params

//   try {
//     // Fetch product details
//     const product = productId
//       ? await Product.findById(productId).populate('Category').populate('SubCategory').populate('supplierId')
//       : null;

//     // Fetch supplier details
//     const supplier = supplierId
//       ? await Supplier.findById(supplierId).populate('products')
//       : null;

//     // Fetch category details
//     const category = categoryId
//       ? await Category.findById(categoryId).populate('products')
//       : null;

//     // Fetch subcategory details
//     const subCategory = subCategoryId
//       ? await SubCategory.findById(subCategoryId).populate('products')
//       : null;

//     // Combine all results into one response
//     res.status(200).json({
//       product,
//       supplier,
//       category,
//       subCategory
//     });
//   } catch (err) {
//     console.error('Error fetching details:', err);
//     res.status(500).json({ error: 'Error fetching details' });
//   }
// };





/*

const Product = require('../models/product');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const Supplier = require('../models/supplier');

const search = async (req, res) => {
  const searchQuery = req.query.searchParams || ''; // Default to empty if not provided
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex

  try {
    // Fetch Products
    const products = await Product.find({
      $or: [
        { ProductName: { $regex: regex } },
        { 'Category.CategoryName': { $regex: regex } },
        { 'SubCategory.SubCategoryName': { $regex: regex } },
        { ItemCode: { $regex: regex } }, // Added search by ItemCode
      ],
    })
      .skip(skip)
      .limit(limit)
      .populate('supplierId', 'name') // Populate supplier name
      .populate('Category', 'CategoryName') // Populate category name
      .populate('SubCategory', 'SubCategoryName') // Populate sub-category name
      .lean();

    const totalProductCount = await Product.countDocuments({
      $or: [
        { ProductName: { $regex: regex } },
        { 'Category.CategoryName': { $regex: regex } },
        { 'SubCategory.SubCategoryName': { $regex: regex } },
        { ItemCode: { $regex: regex } }, // Added search by ItemCode
      ],
    });

    const totalProductPages = Math.ceil(totalProductCount / limit);

    // Format the response
    res.status(200).json({
      products: {
        currentPage: page,
        totalPages: totalProductPages,
        totalCount: totalProductCount,
        data: products.map(product => ({
          productName: product.ProductName,
          itemCode: product.ItemCode, // Ensure ItemCode is included
          categoryName: product.Category?.CategoryName || '',
          subCategoryName: product.SubCategory?.SubCategoryName || '',
          supplierName: product.supplierId?.name || '',
        })),
      },
    });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { search };


*/

/*
const Product = require('../models/product');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const Supplier = require('../models/supplier');

const search = async (req, res) => {
  const searchQuery = req.query.searchParams || ''; // Default to empty if not provided
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex

  try {
    // Fetch Products
    const products = await Product.find({
      $or: [
        { ProductName: { $regex: regex } },
        { 'Category.CategoryName': { $regex: regex } },
        { 'SubCategory.SubCategoryName': { $regex: regex } },
        { ItemCode: { $regex: regex } }, // Added search by ItemCode
      ],
    })
      .skip(skip)
      .limit(limit)
      .populate('supplierId', 'name') // Populate supplier name
      .populate('Category', 'CategoryName') // Populate category name
      .populate('SubCategory', 'SubCategoryName') // Populate sub-category name
      .lean();

    const totalProductCount = await Product.countDocuments({
      $or: [
        { ProductName: { $regex: regex } },
        { 'Category.CategoryName': { $regex: regex } },
        { 'SubCategory.SubCategoryName': { $regex: regex } },
        { ItemCode: { $regex: regex } }, // Added search by ItemCode
      ],
    });

    const totalProductPages = Math.ceil(totalProductCount / limit);

    // Format the response
    res.status(200).json({
      products: {
        currentPage: page,
        totalPages: totalProductPages,
        totalCount: totalProductCount,
        data: products.map(product => ({
          productId: product._id, // Add productId
          supplierId: product.supplierId?._id || '', // Add supplierId
          productName: product.ProductName,
          itemCode: product.ItemCode, // Ensure ItemCode is included
          categoryName: product.Category?.CategoryName || '',
          subCategoryName: product.SubCategory?.SubCategoryName || '',
          supplierName: product.supplierId?.name || '', // Supplier name
          contactNumber: product.supplierId?.contactNumber || '', // Supplier name

        })),
      },
    });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { search };
*/



// const Product = require('../models/product');
// const Category = require('../models/category');
// const SubCategory = require('../models/subCategory');
// const Supplier = require('../models/supplier');

// const search = async (req, res) => {
//   const searchQuery = req.query.searchParams || ''; // Default to empty if not provided
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   const skip = (page - 1) * limit;
//   const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex

//   try {
//     // Fetch Products
//     const products = await Product.find({
//       $or: [
//         { ProductName: { $regex: regex } },
//         { 'Category.CategoryName': { $regex: regex } },
//         { 'SubCategory.SubCategoryName': { $regex: regex } },
//         { ItemCode: { $regex: regex } }, // Added search by ItemCode
//       ],
//     })
//       .skip(skip)
//       .limit(limit)
//       .populate('supplierId', 'name contactNumber') // Populate supplier name and contactNumber
//       .populate('Category', 'CategoryName') // Populate category name
//       .populate('SubCategory', 'SubCategoryName') // Populate sub-category name
//       .lean();

//     const totalProductCount = await Product.countDocuments({
//       $or: [
//         { ProductName: { $regex: regex } },
//         { 'Category.CategoryName': { $regex: regex } },
//         { 'SubCategory.SubCategoryName': { $regex: regex } },
//         { ItemCode: { $regex: regex } }, // Added search by ItemCode
//       ],
//     });

//     const totalProductPages = Math.ceil(totalProductCount / limit);

//     // Format the response
//     res.status(200).json({
//       products: {
//         currentPage: page,
//         totalPages: totalProductPages,
//         totalCount: totalProductCount,
//         data: products.map(product => ({
//           productId: product._id, // Add productId
//           supplierId: product.supplierId?._id || '', // Add supplierId
//           productName: product.ProductName,
//           itemCode: product.ItemCode, // Ensure ItemCode is included
//           categoryName: product.Category?.CategoryName || '',
//           subCategoryName: product.SubCategory?.SubCategoryName || '',
//           supplierName: product.supplierId?.name || '', // Supplier name
//           SupplierContactNumber: product.supplierId?.contactNumber || '', // Supplier contactNumber
//         })),
//       },
//     });
//   } catch (error) {
//     console.error('Error during search:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = { search };



const Product = require('../models/product');

const search = async (req, res) => {
  // const searchQuery = req.query.searchParams || ''; // Default to empty if not provided
  const searchQuery = req.query.searchParams || ''; // Default to empty if not provided

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Build indexed query
    const query = {
      $or: [
        { ProductName: { $regex: searchQuery, $options: 'i' } },
        { 'Category.CategoryName': { $regex: searchQuery, $options: 'i' } },
        { 'SubCategory.SubCategoryName': { $regex: searchQuery, $options: 'i' } },
        { ItemCode: { $regex: searchQuery, $options: 'i' } },
      ],
    };

    // Fetch products using indexes
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .populate('supplierId', 'name contactNumber email') // Populate supplier data
      .populate('Category', 'CategoryName') // Populate category data
      .populate('SubCategory', 'SubCategoryName') // Populate sub-category data
      .lean();

    // Count total matching documents
    const totalProductCount = await Product.countDocuments(query);

    // Calculate total pages
    const totalProductPages = Math.ceil(totalProductCount / limit);

    // Format response
    res.status(200).json({
      products: {
        currentPage: page,
        totalPages: totalProductPages,
        totalCount: totalProductCount,
        data: products.map(product => ({
          productId: product._id, // Product ID
          supplierId: product.supplierId?._id || '', // Supplier ID
          productName: product.ProductName,
          itemCode: product.ItemCode, // Item code
          categoryName: product.Category?.CategoryName || '', // Category name
          subCategoryName: product.SubCategory?.SubCategoryName || '', // Sub-category name
          supplierName: product.supplierId?.name || '', // Supplier name
          supplierContactNumber: product.supplierId?.contactNumber || '', // Supplier contact
          supplierEmailId: product.supplierId?.email || '', // Supplier contact
        })),
      },
    });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { search };
