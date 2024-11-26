const Product = require('../models/product');
const Supplier = require('../models/supplier');
const Category = require('../models/category');


exports.globalSearch = async (req, res) => {
    // const searchQuery = req.query.searchParams || ''; // Default to empty if not provided
    const searchQuery = req.query.q || ''; // Default to empty if not provided

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

exports.getProductsByProductName = async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;

    try {
        const regex = q ? new RegExp(q, 'i') : {};
        const skip = (page - 1) * limit;

        // Find products by product name
        const products = await Product.find({ 'ProductName': regex })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('supplierId', 'name contactNumber email') // Populate supplier data
            .populate('Category', 'CategoryName') // Populate category data
            .populate('SubCategory', 'SubCategoryName') // Populate sub-category data
            .lean();

        // Count total products matching the query
        const totalProductCount = await Product.countDocuments({ 'ProductName': regex });

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
                    supplierEmailId: product.supplierId?.email || '', // Supplier email
                })),
            },
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getProductsByItemCode = async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;

    try {
        const regex = q ? new RegExp(`^${q}`, 'i') : {}; // Match item codes starting with the input
        const skip = (page - 1) * limit;

        // Find products matching the item code
        const products = await Product.find({ ItemCode: regex })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('supplierId', 'name contactNumber email') // Populate supplier data
            .populate('Category', 'CategoryName') // Populate category data
            .populate('SubCategory', 'SubCategoryName') // Populate sub-category data
            .lean();

        // Count total products matching the query
        const totalProductCount = await Product.countDocuments({ ItemCode: regex });

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
                    supplierEmailId: product.supplierId?.email || '', // Supplier email
                })),
            },
        });
    } catch (error) {
        console.error('Error fetching products by item code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getProductsByCategoryName = async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;

    try {
        const regex = q ? new RegExp(q, 'i') : {}; // Case-insensitive match for category name
        const skip = (page - 1) * limit;

        // Find products whose category name matches the query
        const products = await Product.find({ 'Category.CategoryName': regex })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('supplierId', 'name contactNumber email') // Populate supplier data
            .populate('Category', 'CategoryName') // Populate category data
            .populate('SubCategory', 'SubCategoryName') // Populate sub-category data
            .lean();

        // Count total products matching the query
        const totalProductCount = await Product.countDocuments({ 'Category.CategoryName': regex });

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
                    supplierEmailId: product.supplierId?.email || '', // Supplier email
                })),
            },
        });
    } catch (error) {
        console.error('Error fetching products by category name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.getProductsBySubCategoryName = async (req, res) => {
    const { q, page = 1, limit = 500 } = req.query;

    try {
        // Case-insensitive match for sub-category name
        const regex = q ? new RegExp(q, 'i') : undefined;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10); // Calculate how many records to skip

        // Query to find products by sub-category name
        const query = regex ? { 'SubCategory.SubCategoryName': regex } : {};

        // Fetch products
        const products = await Product.find(query)
            .skip(skip)
            .limit(parseInt(limit, 10)) // Ensure limit is an integer
            .populate('supplierId', 'name contactNumber email') // Populate supplier data
            .populate('Category', 'CategoryName') // Populate category data
            .populate('SubCategory', 'SubCategoryName') // Populate sub-category data
            .lean();

        // Count total products matching the query
        const totalProductCount = await Product.countDocuments(query);

        // Calculate total pages
        const totalProductPages = Math.ceil(totalProductCount / limit);

        // Format and send response
        res.status(200).json({
            currentPage: parseInt(page, 10),
            totalPages: totalProductPages,
            totalCount: totalProductCount,
            products: products.map(product => ({
                productId: product._id, // Product ID
                supplierId: product.supplierId?._id || '', // Supplier ID
                productName: product.ProductName,
                itemCode: product.ItemCode, // Item code
                categoryName: product.Category?.CategoryName || '', // Category name
                subCategoryName: product.SubCategory?.SubCategoryName || '', // Sub-category name
                supplierName: product.supplierId?.name || '', // Supplier name
                supplierContactNumber: product.supplierId?.contactNumber || '', // Supplier contact
                supplierEmailId: product.supplierId?.email || '', // Supplier email
            })),
        });
    } catch (error) {
        console.error('Error fetching products by subcategory name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};






exports.getProductsBySupplierName = async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;

    try {
        const regex = q ? new RegExp(q, 'i') : {};
        const skip = (page - 1) * limit;

        // Find suppliers matching the query

        const matchingSuppliers = await Supplier.find({ name: regex }).select('_id').lean();

        if (!matchingSuppliers.length) {
            return res.status(404).json({ message: 'No suppliers found with the given name' });
        }

        const supplierIds = matchingSuppliers.map(supplier => supplier._id);

        // Find products associated with matching suppliers
        const products = await Product.find({ supplierId: { $in: supplierIds } })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('supplierId', 'name contactNumber email') // Populate supplier data
            .populate('Category', 'CategoryName') // Populate category data
            .populate('SubCategory', 'SubCategoryName') // Populate sub-category data
            .lean();

        // Count total products matching the query
        const totalProductCount = await Product.countDocuments({ supplierId: { $in: supplierIds } });

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
                    supplierEmailId: product.supplierId?.email || '', // Supplier email
                })),
            },
        });
    } catch (error) {
        console.error('Error fetching products by supplier name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

