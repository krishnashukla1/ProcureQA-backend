
const Product = require('../models/product');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Supplier = require('../models/supplier');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');

exports.uploadBulkProducts = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an Excel file.' });
    }

    const { supplierId } = req.params;

    try {
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        const workbook = xlsx.readFile(filePath);
        const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        console.log("Columns:", Object.keys(xlData[0]).join(', '));

        const itemCodes = new Set();
        const duplicateItemCodes = [];
        const missingFieldsResponse = [] || 0;
        const successfulUploads = [];
        const uploadErrors = [];
        const requiredFields = ['Product Name', 'Item Code*', 'Unit*', 'Group', 'Brand', 'Description'];

        let successCount = 0;   // Counter for successful uploads
        let rejectCount = 0;    // Counter for failed uploads (missing fields, duplicate item codes)
        let duplicateItemCount = 0; // Counter for duplicate item codes in the file
        let categoryCount = 0;  // Counter for unique categories
        let subCategoryCount = 0; // Counter for unique subcategories
        let missingFieldCount=0;

        // Iterate through each row in the Excel file
        for (const [index, row] of xlData.entries()) {
            const missingFields = [];

            // Trim whitespace from both column names and values
            const trimmedRow = Object.fromEntries(
                Object.entries(row).map(([key, value]) => [key.trim(), (value || '').toString().trim()])
            );

            // Check for missing fields
            requiredFields.forEach(field => {
                if (!trimmedRow[field] || trimmedRow[field] === '') {
                    missingFields.push(field);
                    missingFieldCount++;
                }
            });

            if (missingFields.length > 0) {
                missingFieldsResponse.push({ row: index + 1, missingFields });
                uploadErrors.push({
                    row: index + 1,
                    error: `Missing fields: ${missingFields.join(', ')}`,
                });
                continue;
            }

            const { 'Item Code*': itemCode, 'Product Name': productName, 'Unit*': unit, 'Group': group, 'Brand': brand, 'Description': description } = trimmedRow;

            // Check for duplicate Item Code within the file
            if (itemCode) {
                if (itemCodes.has(itemCode)) {
                    duplicateItemCodes.push({ row: index + 1, itemCode });
                    uploadErrors.push({
                        row: index + 1,
                        error: `Duplicate Item Code* found in Excel file: ${itemCode}`,
                    });
                    duplicateItemCount++; // Increment duplicate item code count
                    // rejectCount++; // Increment rejectCount on itemCode duplication
                    continue;
                } else {
                    itemCodes.add(itemCode);
                }
            }

            // Check if Item Code already exists in DB
            const existingProduct = await Product.findOne({ ItemCode: itemCode });
            if (existingProduct) {
                uploadErrors.push({
                    row: index + 1,
                    error: `Duplicate Item Code* found in database: ${itemCode}`,
                });
                // rejectCount++; // Increment rejectCount on itemCode duplication in DB
                duplicateItemCount++; 
                continue;
            }

            // Fetch or Create Category
            let category = await Category.findOne({ name: group });
            if (!category) {
                // category = new Category({ name: group });
                category = new Category({ name: group, imagePath: null }); 
                await category.save();
                console.log(`New Category added: ${group}`);
                categoryCount++; // Increment category count for new categories
            }
            const categoryId = category._id;

            // Fetch or Create SubCategory
            let subCategory = await SubCategory.findOne({ name: brand, categoryId: categoryId });
            if (!subCategory) {
                subCategory = new SubCategory({ name: brand, categoryId: categoryId });
                try {
                    await subCategory.save();
                    console.log(`New SubCategory added: ${brand}`);
                    subCategoryCount++; // Increment subcategory count for new subcategories
                } catch (subCategoryError) {
                    if (subCategoryError.code === 11000) {
                        console.log(`SubCategory "${brand}" already exists. Skipping creation.`);
                        // Do not increment rejectCount here as subcategory skipping is not an error
                    } else {
                        console.error(`Error creating SubCategory: ${subCategoryError.message}`);
                        uploadErrors.push({
                            row: index + 1,
                            error: subCategoryError.message,
                        });
                        // rejectCount++; // Increment rejectCount on error during subcategory creation
                    }
                }
            } else {
                console.log(`SubCategory "${brand}" already exists. Skipping creation.`);
                // Do not increment rejectCount here as subcategory skipping is not an error
            }

            // Add Product to Database
            try {
                const newProduct = new Product({
                    ProductName: productName,
                    ItemCode: itemCode,
                    Category: {
                        CategoryID: categoryId,
                        CategoryName: group,
                    },
                    SubCategory: {
                        SubCategoryID: subCategory._id,
                        SubCategoryName: brand,
                        CategoryID: categoryId,
                    },
                    Unit: unit,
                    Description: description,
                    supplierId: supplierId,
                });

                await newProduct.save();
                console.log(`Product added: ${productName}`);
                successfulUploads.push({ row: index + 1, productName });
                successCount++; // Increment successCount on successful product addition

            } catch (productError) {
                console.error(`Error saving product on row ${index + 1}:`, productError.message);
                uploadErrors.push({
                    row: index + 1,
                    error: productError.message,
                });
                // rejectCount++; // Increment rejectCount on product save error
            }
        }

        // Calculate final rejectCount as the sum of duplicate item codes and missing fields
        rejectCount = `Total Failed : ${duplicateItemCount+(missingFieldCount)}`;

        // Prepare response with details of successful and failed uploads
        return res.status(200).json({
            message: 'Bulk products upload completed.',
            successfulUploads,
            errors: uploadErrors,
            successCount,      // Total successful uploads (products and subcategories)
            rejectCount,       // Total rejections due to missing fields or duplicate item codes
            duplicateItemCount, // Count of products with duplicate Item Codes in the file
            categoryCount,     // Count of categories created
            subCategoryCount,  // Count of subcategories created
            missingFields: missingFieldsResponse,
        });

    } catch (err) {
        console.error('Error processing the Excel file:', err);
        res.status(500).json({ message: 'Error processing the Excel file.' });
    }
};




// exports.createProduct = async (req, res) => {
//     const {
//         ProductName, ItemCode, Unit, Description,
//         Category, SubCategory, supplierId
//     } = req.body;
//     console.log("body data--",req.body);
    
//     try {
//         // console.log(supplierId); // Log supplierId to check if it's passed correctly

//         // Find the supplier by its ObjectId (supplierId)
//         const supplier = await Supplier.findById(supplierId);
//         if (!supplier) {
//             return res.status(404).json({ message: 'Supplier not found' });
//         }

//         // Validate Category and SubCategory objects
//         console.log(Category, SubCategory); // Log Category and SubCategory for debugging
//         if (!Category || !Category.CategoryID || !Category.CategoryName ||
//             !SubCategory || !SubCategory.SubCategoryID || !SubCategory.SubCategoryName) {
//             return res.status(400).json({ message: 'Category and SubCategory are required with valid IDs and names' });
//         }
// console.log("-------before save-----");

//         // Create new product
//         const newProduct = new Product({
//             ProductName,
//             ItemCode,
//             Unit,
//             Description,
//             Category: {
//                 CategoryID: Category.CategoryID,
//                 CategoryName: Category.CategoryName,
//             },
//             SubCategory: {
//                 SubCategoryID: SubCategory.SubCategoryID,
//                 SubCategoryName: SubCategory.SubCategoryName,
//                 CategoryID: SubCategory.CategoryID,
//             },
//             supplierId: supplier._id, // Use the supplier's ObjectId passed from the request
//         });

//         console.log(newProduct); // Log the newProduct object before saving

//         // Save the new product to the database
//         await newProduct.save();

//         // Respond with success message and the created product
//         res.status(201).json({ message: 'Product created successfully', product: newProduct });
//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         res.status(500).json({ message: 'Error creating product', error: error.message });
//     }
// };


//------------------------------------------------

exports.createProduct = async (req, res) => {
    const {
        ProductName, 
        ItemCode, 
        Unit, 
        Description,
        Category, 
        SubCategory, 
        supplierId
    } = req.body;

    try {
        console.log("Request body data:", req.body); // Log request data for debugging

        // Validate mandatory fields
        if (!ProductName || !ItemCode || !Unit || !supplierId) {
            return res.status(400).json({ 
                message: 'ProductName, ItemCode, Unit, and supplierId are required fields.' 
            });
        }

        // Check if supplier exists
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }

        // Validate Category and SubCategory
        if (
            !Category || 
            !Category.CategoryID || 
            !Category.CategoryName || 
            !SubCategory || 
            !SubCategory.SubCategoryID || 
            !SubCategory.SubCategoryName
        ) {
            return res.status(400).json({ 
                message: 'Valid Category and SubCategory are required.' 
            });
        }

        // console.log("Category and SubCategory:", Category, SubCategory);

        // Check for duplicate ItemCode in the database
        const existingProduct = await Product.findOne({ ItemCode });
        if (existingProduct) {
            return res.status(400).json({ 
                message: `Product with ItemCode "${ItemCode}" already exists.` 
            });
        }

        // Create the new product
        const newProduct = new Product({
            ProductName,
            ItemCode,
            Unit,
            Description: Description || null, // Allow optional description
            Category: {
                CategoryID: Category.CategoryID,
                CategoryName: Category.CategoryName,
            },
            SubCategory: {
                SubCategoryID: SubCategory.SubCategoryID,
                SubCategoryName: SubCategory.SubCategoryName,
                CategoryID: SubCategory.CategoryID,
            },
            supplierId: supplier._id
            // name: supplier.companyName // Link supplier's ObjectId
        });

        // console.log("New Product to save:", newProduct);

        // Save the product to the database
        await newProduct.save();

        // Return success response with the saved product details
        res.status(201).json({ 
            message: 'Product created successfully.', 
            product: newProduct 
        });

    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ 
            message: 'Error creating product.', 
            error: error.message 
        });
    }
};

//------------------------------------------------



// exports.getProducts = async (req, res) => {
//     try {
//         // Extract and validate pagination parameters from the query
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         // Calculate skip value for pagination
//         const skip = (page - 1) * limit;

//         // Fetch products based on pagination
//         const products = await Product.find().skip(skip).limit(limit);

//         // Get total product count
//         const totalCount = await Product.countDocuments();

//         // Calculate total number of pages
//         const totalPages = Math.ceil(totalCount / limit);

//         // Respond with paginated data
//         res.status(200).json({
//             currentPage: page,
//             totalPages: totalPages,
//             totalProducts: totalCount,
//             products: products
//         });
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ message: 'Error fetching products', error: error.message });
//     }
// };



// API to get a product by ID


exports.getProducts = async (req, res) => {
    try {
        // Extract and validate pagination parameters from the query
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Fetch products based on pagination
        const products = await Product.find().skip(skip).limit(limit);

        // Get total product count
        const totalCount = await Product.countDocuments();

        // Calculate total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        // Respond with paginated data
        res.status(200).json({
            code: 200,
            error: false,
            message: 'Products fetched successfully',
            pagination: {
                totalElements: totalCount,
                totalPages: totalPages,
                size: limit,
                pageNo: page,
                numberOfElements: products.length
            },
            data: {
                products: products
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            code: 500,
            error: true,
            message: 'Error fetching products',
            pagination: null,
            data: null
        });
    }
};




exports.getProductById = async (req, res) => {
    const { id } = req.params;  // Product ID from the URL params

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

//1] normal search by product name

// exports.getProductByName = async (req, res) => {
//     const { name } = req.params;

//     try {
//         const regex = new RegExp(name, 'i'); // Case-insensitive search
//         const page = parseInt(req.query.page) || 1; // Current page
//         const limit = parseInt(req.query.limit) || 10; // Results per page
//         const skip = (page - 1) * limit;

//         // Fetch products by ProductName, including pagination
//         const products = await Product.find({ ProductName: { $regex: regex } })
//             .skip(skip)
//             .limit(limit)
//             .select('ProductName ItemCode Category SubCategory Unit supplierId');

//         if (products.length === 0) {
//             return res.status(404).json({ message: 'No products found with the specified name' });
//         }

//         // Get the total count of matching products for pagination
//         const totalCount = await Product.countDocuments({ ProductName: { $regex: regex } });
//         const totalPages = Math.ceil(totalCount / limit);

//         res.status(200).json({
//             currentPage: page,
//             totalPages: totalPages,
//             totalProducts: totalCount,
//             products: products
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching products by name', error: error.message });
//     }
// };

//2]  indexing search by product name


// exports.getProductByName = async (req, res) => {
//     const { name } = req.params;

//     try {
//         const regex = new RegExp(name, 'i'); // Case-insensitive search
//         const page = parseInt(req.query.page) || 1; // Current page
//         const limit = parseInt(req.query.limit) || 10; // Results per page
//         const skip = (page - 1) * limit;

//         // Fetch products by ProductName, including pagination
//         const products = await Product.find({ ProductName: { $regex: regex } })
//             .skip(skip)
//             .limit(limit)
//             .select('ProductName ItemCode Category SubCategory Unit supplierId');

//         if (products.length === 0) {
//             return res.status(404).json({ message: 'No products found with the specified name' });
//         }

//         // Get the total count of matching products for pagination
//         const totalCount = await Product.countDocuments({ ProductName: { $regex: regex } });
//         const totalPages = Math.ceil(totalCount / limit);

//         res.status(200).json({
//             currentPage: page,
//             totalPages: totalPages,
//             totalProducts: totalCount,
//             products: products
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching products by name', error: error.message });
//     }
// };


// 3] indexing search by prodcut name with q=product name

exports.getProductsByQuery = async (req, res) => {
    const { q } = req.query; // Extract query parameter `q` (search term)

    try {
        // If `q` is provided, use regex for case-insensitive search, otherwise search for all
        const regex = q ? new RegExp(q, 'i') : {}; // Regex search for `q` (case-insensitive)

        const page = parseInt(req.query.page) || 1; // Current page (default: 1)
        const limit = parseInt(req.query.limit) || 10; // Results per page (default: 10)
        const skip = (page - 1) * limit; // Skip products based on the current page

        // Search for products where `ProductName` or `ItemCode` matches the query
        const products = await Product.find({
            $or: [
                { ProductName: regex }, // Search by ProductName
                { ItemCode: regex }     // Search by ItemCode
            ]
        })
        .skip(skip)
        .limit(limit)
        .select('ProductName ItemCode Category SubCategory Unit supplierId name'); // Select relevant fields

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        // Get the total count of matching products for pagination
        const totalCount = await Product.countDocuments({
            $or: [
                { ProductName: regex },
                { ItemCode: regex }
            ]
        });
        const totalPages = Math.ceil(totalCount / limit);

        // Send the response with the relevant data
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalProducts: totalCount,
            products: products
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};







exports.updateProduct = async (req, res) => {
    const { id } = req.params;  // Product ID from the URL params
    const {
        ProductName, ItemCode, Unit, Description,
        Category, SubCategory
    } = req.body;

    try {
        // Find the supplier by name
        // const supplier = await Supplier.findById({ name: supplierId });
        // if (!supplier) {
        //     return res.status(404).json({ message: 'Supplier not found' });
        // }

        // Validate Category and SubCategory objects
        if (Category && (!Category.CategoryID || !Category.CategoryName)) {
            return res.status(400).json({ message: 'Valid Category information is required' });
        }
        if (SubCategory && (!SubCategory.SubCategoryID || !SubCategory.SubCategoryName)) {
            return res.status(400).json({ message: 'Valid SubCategory information is required' });
        }

        // Find the product and update it
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                ProductName,
                ItemCode,
                Unit,
                Description,
                Category: Category ? {
                    CategoryID: Category.CategoryID,
                    CategoryName: Category.CategoryName,
                } : undefined,
                SubCategory: SubCategory ? {
                    SubCategoryID: SubCategory.SubCategoryID,
                    SubCategoryName: SubCategory.SubCategoryName,
                    CategoryID: SubCategory.CategoryID,
                } : undefined,
                // supplierId: supplier._id,
            },
            { new: true }  // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;  // Product ID from the URL params

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};


exports.getAllCategories = async (req, res) => {
    try {
        // Fetch distinct category names from the 'Category.CategoryName' field in the 'Product' collection
        const categories = await Product.distinct('Category.CategoryName');

        if (categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        res.status(200).json({
            categories
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

exports.getAllSubCategories = async (req, res) => {
    try {
        // Fetch distinct subcategory names from the 'SubCategory.SubCategoryName' field in the 'Product' collection
        const subCategories = await Product.distinct('SubCategory.SubCategoryName');

        if (subCategories.length === 0) {
            return res.status(404).json({ message: 'No subcategories found' });
        }

        res.status(200).json({
            subCategories
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
    }
};

//1] normal search by category name
// exports.getProductsByCategory = async (req, res) => {
//     const { category } = req.params;

//     try {
//         const categoryRegex = new RegExp(category, 'i'); // Case-insensitive search
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         // Fetch products by CategoryName with pagination
//         const products = await Product.find({
//             'Category.CategoryName': { $regex: categoryRegex }
//         })
//             .skip(skip)
//             .limit(limit)
//             .select('ProductName ItemCode Category SubCategory Unit supplierId createdAt updatedAt');

//         if (products.length === 0) {
//             return res.status(404).json({ message: 'No products found for the specified category' });
//         }

//         // Get total count for pagination
//         const totalCount = await Product.countDocuments({
//             'Category.CategoryName': { $regex: categoryRegex }
//         });
//         const totalPages = Math.ceil(totalCount / limit);

//         // Map the products for better formatting
//         const result = products.map(product => ({
//             id: product._id,
//             ProductName: product.ProductName,
//             ItemCode: product.ItemCode,
//             Category: product.Category,
//             SubCategory: product.SubCategory,
//             Unit: product.Unit,
//             supplierId: product.supplierId,
//             createdAt: new Date(product.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
//             updatedAt: new Date(product.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
//         }));

//         res.status(200).json({
//             currentPage: page,
//             totalPages,
//             totalProducts: totalCount,
//             products: result
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching products by category', error: error.message });
//     }
// };

//2] indexing search by category name

exports.getProductsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const categoryRegex = new RegExp(category, 'i'); // Case-insensitive search
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch products by CategoryName with pagination
        const products = await Product.find({
            'Category.CategoryName': { $regex: categoryRegex }

            // 'Category.CategoryName': { $regex: categoryRegex } }).explain('executionStats');  //  Use the explain() method to analyze how MongoDB uses the indexes:

        })
            .skip(skip)
            .limit(limit)
            .select('ProductName ItemCode Category SubCategory Unit supplierId createdAt updatedAt');

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the specified category' });
        }

        // Get total count for pagination
        const totalCount = await Product.countDocuments({
            'Category.CategoryName': { $regex: categoryRegex }
        });
        const totalPages = Math.ceil(totalCount / limit);

        // Map the products for better formatting
        const result = products.map(product => ({
            id: product._id,
            ProductName: product.ProductName,
            ItemCode: product.ItemCode,
            Category: product.Category,
            SubCategory: product.SubCategory,
            Unit: product.Unit,
            supplierId: product.supplierId,
            createdAt: new Date(product.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            updatedAt: new Date(product.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        }));

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalProducts: totalCount,
            products: result
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by category', error: error.message });
    }
};


//1] normal search by csubcategory name

// exports.getProductsBySubcategory = async (req, res) => {
//     const { subcategory } = req.params;

//     try {
//         const subcategoryRegex = new RegExp(subcategory, 'i'); // Case-insensitive search
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         // Fetch products by SubCategoryName with pagination
//         const products = await Product.find({
//             'SubCategory.SubCategoryName': { $regex: subcategoryRegex }
//         })
//             .skip(skip)
//             .limit(limit)
//             .select('ProductName ItemCode Category SubCategory Unit supplierId createdAt updatedAt');

//         if (products.length === 0) {
//             return res.status(404).json({ message: 'No products found for the specified subcategory' });
//         }

//         // Get total count for pagination
//         const totalCount = await Product.countDocuments({
//             'SubCategory.SubCategoryName': { $regex: subcategoryRegex }
//         });
//         const totalPages = Math.ceil(totalCount / limit);

//         // Map the products for better formatting
//         const result = products.map(product => ({
//             id: product._id,
//             ProductName: product.ProductName,
//             ItemCode: product.ItemCode,
//             Category: product.Category,
//             SubCategory: product.SubCategory,
//             Unit: product.Unit,
//             supplierId: product.supplierId,
//             createdAt: new Date(product.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
//             updatedAt: new Date(product.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
//         }));

//         res.status(200).json({
//             currentPage: page,
//             totalPages,
//             totalProducts: totalCount,
//             products: result
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching products by subcategory', error: error.message });
//     }
// };

// 2] ndexing search by subcategory name

exports.getProductsBySubcategory = async (req, res) => {
    const { subcategory } = req.params;

    try {
        const subcategoryRegex = new RegExp(subcategory, 'i'); // Case-insensitive search
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch products by SubCategoryName with pagination
        const products = await Product.find({
            'SubCategory.SubCategoryName': { $regex: subcategoryRegex }
        })
            .skip(skip)
            .limit(limit)
            .select('ProductName ItemCode Category SubCategory Unit supplierId createdAt updatedAt');

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the specified subcategory' });
        }

        // Get total count for pagination
        const totalCount = await Product.countDocuments({
            'SubCategory.SubCategoryName': { $regex: subcategoryRegex }
        });
        const totalPages = Math.ceil(totalCount / limit);

        // Map the products for better formatting
        const result = products.map(product => ({
            id: product._id,
            ProductName: product.ProductName,
            ItemCode: product.ItemCode,
            Category: product.Category,
            SubCategory: product.SubCategory,
            Unit: product.Unit,
            supplierId: product.supplierId,
            createdAt: new Date(product.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            updatedAt: new Date(product.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        }));

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalProducts: totalCount,
            products: result
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by subcategory', error: error.message });
    }
};



// exports.getProductsBySupplierId = async (req, res) => {
//     const { supllierId } = req.params;

//     try {
//         console.log();
        
//         const supllierIdRegex = new RegExp(supllierId, 'i'); // Case-insensitive search
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         // Fetch products by SubCategoryName with pagination
//         const products = await Product.find({
//             'supplierId': { $regex: supllierIdRegex }
//         })
//             .skip(skip)
//             .limit(limit)
//             .select('ProductName ItemCode Category SubCategory Unit supplierId createdAt updatedAt');

//         if (products.length === 0) {
//             return res.status(404).json({ message: 'No products found for the supplierId' });
//         }

//         // Get total count for pagination
//         const totalCount = await Product.countDocuments({
//             'supplierId': { $regex: supllierIdRegex }
//         });
//         const totalPages = Math.ceil(totalCount / limit);

//         // Map the products for better formatting
//         const result = products.map(product => ({
//             id: product._id,
//             ProductName: product.ProductName,
//             ItemCode: product.ItemCode,
//             Category: product.Category,
//             SubCategory: product.SubCategory,
//             Unit: product.Unit,
//             supplierId: product.supplierId,
//             createdAt: new Date(product.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
//             updatedAt: new Date(product.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
//         }));

//         res.status(200).json({
//             currentPage: page,
//             totalPages,
//             totalProducts: totalCount,
//             products: result
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching products by subcategory', error: error.message });
//     }
// };


