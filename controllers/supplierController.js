const Supplier = require('../models/supplier');
const Product = require('../models/product');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const multer = require('multer');
const path = require('path');

exports.getAllSuppliers = async (req, res) => {
  try {
    // Get the page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 5; // Default to 10 items per page if not specified

    // Calculate the starting index for the query
    const skip = (page - 1) * limit;

    // Fetch suppliers with pagination
    const suppliers = await Supplier.find()
      .skip(skip)
      .limit(limit);

    // Transform the response to remove the extra `id`
    const result = suppliers.map(supplier => ({
      id: supplier._id,
      name: supplier.name,
      officeAddress: supplier.officeAddress,
      contactNumber: supplier.contactNumber,
      email: supplier.email,
      // productCategories: supplier.productCategories,
      // productSubCategories: supplier.productSubCategories,
      // products:supplier.products,

      // createdAt: supplier.createdAt,
      // updatedAt: supplier.updatedAt


      createdAt: new Date(supplier.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      updatedAt: new Date(supplier.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    }));

    // Get the total number of suppliers for calculating total pages
    const totalSuppliers = await Supplier.countDocuments();
    const totalPages = Math.ceil(totalSuppliers / limit);

    // Return paginated results along with pagination info
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalSuppliers: totalSuppliers,
      suppliers: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching suppliers' });
  }
};


exports.getSupplierById = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  res.json(supplier);
};


exports.createSupplier = async (req, res) => {
  // const { name, officeAddress,companyName, contactNumber, email, productCategories,productSubCategories } = req.body;
  const { name, officeAddress, companyName, contactNumber, email } = req.body;

  try {
    // Check if a supplier with the same email already exists
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
    }

    // Create a new supplier object
    const newSupplier = new Supplier({
      name,
      officeAddress,
      contactNumber,
      email,
      companyName,
      // productCategories,
      // productSubCategories,
      // products
    });

    // Save the supplier to the database
    const savedSupplier = await newSupplier.save();

    res.status(201).json({
      message: 'Supplier created successfully',
      supplier: savedSupplier
    });
  } catch (error) {
    // Handle unique constraint errors
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email must be unique', error: error.message });
    }
    res.status(500).json({ message: 'Error creating supplier', error: error.message });
  }
};


exports.updateSupplier = async (req, res) => {
  const { id } = req.params;  // Supplier ID from the URL params
  const { name, officeAddress, contactNumber, email, productCategories, productSubCategories } = req.body;

  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { name, officeAddress, contactNumber, email, productCategories, productSubCategories },
      { new: true }  // Return the updated document
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.status(200).json({
      message: 'Supplier updated successfully',
      supplier: updatedSupplier
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;  // Supplier ID from the URL params

  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.status(200).json({
      message: 'Supplier deleted successfully',
      supplier: deletedSupplier
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error: error.message });
  }
};


exports.getSuppliersByName = async (req, res) => {
  const supplierName = req.query.name;  // Use query param 'name'
  const regex = new RegExp(supplierName, 'i'); // Case-insensitive search

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    // Find suppliers by name (not _id)
    const suppliers = await Supplier.find({ name: { $regex: regex } })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'productCategories',  // Populate the productCategories array with Category data
        select: 'name',             // Only select the 'name' field from the Category collection
      })
      .populate({
        path: 'productSubCategories', // Populate the productSubCategories array with SubCategory data
        select: 'name',              // Only select the 'name' field from the SubCategory collection
      })
      .populate({
        path: 'products',            // Populate the products array with Product data
        select: 'ProductName',       // Only select the 'ProductName' field from the Product collection
      });

    const totalSuppliers = await Supplier.countDocuments({ name: { $regex: regex } });
    const totalPages = Math.ceil(totalSuppliers / limit);
    const countPage = suppliers.length;

    if (!suppliers || suppliers.length === 0) {
      return res.status(404).json({ message: 'No suppliers found' });
    }

    const result = suppliers.map(supplier => ({
      id: supplier._id,
      name: supplier.name,
      productCategories: supplier.productCategories ? supplier.productCategories.map(category => category.name) : [],
      productSubCategories: supplier.productSubCategories ? supplier.productSubCategories.map(subcategory => subcategory.name) : [],
      products: supplier.products ? supplier.products.map(product => product.ProductName) : [],
    }));

    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      countPage: countPage,
      totalSuppliers: totalSuppliers,
      suppliers: result,
    });
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ error: 'Error fetching suppliers' });
  }
};





// POST route to create a new supplier
// exports.insertSupplier = async (req, res) => {
//   try {
//     const { name, email, companyName, companyType, companyLogo, officeAddress, contactNumber, productCategories, productSubCategories, products } = req.body;

//     // Validate that the required fields are provided
//     if (!name || !email || !companyName || !companyType || !companyLogo || !officeAddress || !contactNumber) {
//       return res.status(400).json({ message: 'All required fields must be provided' });
//     }

//     // Create a new supplier
//     const newSupplier = new Supplier({
//       name,
//       email,
//       companyName,
//       companyType,
//       companyLogo,
//       officeAddress,
//       contactNumber,
//       productCategories,
//       productSubCategories,
//       products
//     });

//     // Save the new supplier to the database
//     const savedSupplier = await newSupplier.save();

//     res.status(201).json(savedSupplier);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating supplier', error: error.message });
//   }
// };



// exports.insertSupplier = async (req, res) => {
//   try {
//     const { 
//       name, 
//       email, 
//       companyName, 
//       companyType = 'Not Specified',  // Default to 'Not Specified' if companyType is not provided
//       companyLogo, 
//       officeAddress, 
//       contactNumber, 
//       productCategories, 
//       productSubCategories, 
//       products 
//     } = req.body;

//     console.log(req.body); // Log the request body to check the values being sent

//     if (!name || !email || !companyName || !officeAddress || !contactNumber) {
//       return res.status(400).json({ message: 'All required fields must be provided' });
//     }

//     const contactNumberRegex = /^\d{3} \d{8}$/;
//     if (contactNumber && !contactNumberRegex.test(contactNumber)) {
//       return res.status(400).json({ message: 'Contact number must be in the format: XXX XXXXXXXXX' });
//     }

//     // Now we can be sure that companyType has a value, either from the request or the default
//     const newSupplier = new Supplier({
//       name,
//       email,
//       companyName,
//       companyType,  // companyType will be either passed or the default value
//       companyLogo,  // If not provided, this will be undefined or the provided value
//       officeAddress,
//       contactNumber,
//       productCategories,
//       productSubCategories,
//       products
//     });

//     // Save the supplier to the database
//     const savedSupplier = await newSupplier.save();

//     res.status(201).json({ message: "Supplier created successfully", supplier: savedSupplier });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating supplier', error: error.message });
//   }
// };





// GET route to get all suppliers (only companyName, companyType, and companyLogo)
// exports.getSuppliers = async (req, res) => {
//   try {
//     // Fetch suppliers and select only the fields we need
//     const suppliers = await Supplier.find({}, 'companyName companyType companyLogo');

//     res.status(200).json(suppliers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
//   }
// };







// exports.insertSupplier = async (req, res) => {
//   try {
//     console.log(req.body);  // Check what is being received

//     const {
//       name,
//       email,
//       companyName,
//       companyType,
//       companyLogo,
//       officeAddress,
//       contactNumber,
//       productCategories,
//       productSubCategories,
//       products
//     } = req.body;

//     if (!name || !email || !companyName || !companyType || !companyLogo || !officeAddress || !contactNumber) {
//       return res.status(400).json({ message: 'All required fields must be provided' });
//     }

//     const contactNumberRegex = /^\d{3} \d{8}$/;
//     if (contactNumber && !contactNumberRegex.test(contactNumber)) {
//       return res.status(400).json({ message: 'Contact number must be in the format: XXX XXXXXXXXX' });
//     }

//     // Now we can be sure that companyType has a value, either from the request or the default
//     const newSupplier = new Supplier({
//       name,
//       email,
//       companyName,
//       companyType,
//       companyLogo,
//       officeAddress,
//       contactNumber,
//       productCategories,
//       productSubCategories,
//       products
//     });

//     const savedSupplier = await newSupplier.save();
//     // console.log(savedSupplier);

//     res.status(201).json({ message: "Supplier created successfully", supplier: savedSupplier });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating supplier', error: error.message });
//   }
// };









// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name with original extension
  }
});

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB size limit
});


const BASE_URL = "http://65.2.0.34:5000"; // AWS server URL

exports.insertSupplier = async (req, res) => {
  try {
    upload.single('companyLogo')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const {
        name,
        email,
        companyName,
        companyType,
        officeAddress,
        contactNumber,
        productCategories,
        productSubCategories,
        products
      } = req.body;

      if (!name || !email || !companyName || !companyType || !req.file || !officeAddress || !contactNumber) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      const contactNumberRegex = /^\d{3} \d{8}$/;
      if (contactNumber && !contactNumberRegex.test(contactNumber)) {
        return res.status(400).json({ message: 'Contact number must be in the format: XXX XXXXXXXXX' });
      }

      const newSupplier = new Supplier({
        name,
        email,
        companyName,
        companyType,
        companyLogo: `${BASE_URL}/${req.file.path.replace(/\\/g, '/')}`, // Append base URL and replace backslashes
        officeAddress,
        contactNumber,
        productCategories,
        productSubCategories,
        products
      });

      const savedSupplier = await newSupplier.save();

      res.status(201).json({ message: "Supplier created successfully", supplier: savedSupplier });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating supplier', error: error.message });
  }
};





// GET route to get all suppliers (only companyName, companyType, and companyLogo)
exports.getSuppliers = async (req, res) => {
  try {


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;



    // Fetch suppliers and select only the fields we need
    const suppliers = await Supplier.find({}, 'companyName companyType companyLogo')
      .skip(skip) // Skip documents
      .limit(limit); // Limit the number of documents

    // Fetch total count of suppliers (for calculating total pages)
    const totalSuppliers = await Supplier.countDocuments();
    const totalPages = Math.ceil(totalSuppliers / limit);

    res.status(200).json({
      page,
      totalPages,
      totalSuppliers,
      suppliers,
    });
    // res.status(200).json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
  }
};


// GET route to search suppliers by name (supports query parameter `q`)
exports.getSuppliersbyQuery = async (req, res) => {
  const { q } = req.query; // Extract the query parameter `q`

  try {
    // If `q` is provided, use regex for case-insensitive search, otherwise fetch all suppliers
    const regex = q ? new RegExp(q, 'i') : {};





    // Fetch suppliers matching the search criteria, selecting specific fields
    const suppliers = await Supplier.find({ companyName: regex }).select('companyName companyType companyLogo');


    // Fetch suppliers matching the search criteria (fetch all fields)
    //  const suppliers = await Supplier.find({ companyName: regex });






    if (suppliers.length === 0) {
      return res.status(404).json({ message: 'No suppliers found' });
    }

    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
  }
};




