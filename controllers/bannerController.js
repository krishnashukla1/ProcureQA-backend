const Banner = require('../models/banner');
const Category = require('../models/category');
const Supplier = require('../models/supplier');
const dotenv = require('dotenv');
require('dotenv').config(); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BASE_URL = process.env.BASE_URL; 





// GET /api/admin/banner - Fetch banner details along with related category and supplier information
const getBanners = async (req, res) => {
  try {
    // Fetch banners along with category and supplier info
    const banners = await Banner.find()
      .populate('categoryId', 'name categoryImagePath')  // Populate category data: name and categoryImagePath
      .populate('supplierId', 'name companyLogo');      // Populate supplier data: name and companyLogo

    res.status(200).json({ banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// const getBannerss = async (req, res) => {
//   try {
//     // Fetch banners along with category and supplier info
//     const banners = await Banner.find()
//       .populate('categoryId', 'name categoryImagePath')  // Populate category data: name and categoryImagePath
//       .populate('supplierId', 'name companyLogo');      // Populate supplier data: name and companyLogo

//     // Count banners, categories, and suppliers
//     const bannerCnt = banners.length;
//     const categoryCnt = new Set(banners.map(b => b.categoryId?._id.toString())).size;
//     const supplierCnt = new Set(banners.map(b => b.supplierId?._id.toString())).size;

//     // Format response data
//     const formattedResponse = {
//       page: 1, // Static for now; you can update with pagination logic if needed
//       totalPages: 1, // Static for now; update for actual pagination
//       totalCnt: bannerCnt, // Total number of banners
//       bannerCnt, // Number of banners
//       categoryCnt, // Number of unique categories
//       supplierCnt, // Number of unique suppliers
//       banners: banners.map(banner => ({
//         _id: banner._id,
//         bannerImage: `http://192.168.1.202:5000/images/bannerImage/${banner.bannerImage}`, // Adjust according to your field name
//         category: banner.categoryId ? {
//           _id: banner.categoryId._id,
//           name: banner.categoryId.name,
//           categoryImagePath: `http://192.168.1.202:5000/images/categoryImage/${banner.categoryId.categoryImagePath}`
//         } : null,
//         supplier: banner.supplierId ? {
//           _id: banner.supplierId._id,
//           name: banner.supplierId.name,
//           companyLogo: `http://192.168.1.202:5000/images/cmpLogo/${banner.supplierId.companyLogo}`
//         } : null
//       }))
//     };

//     // Send response
//     res.status(200).json(formattedResponse);
//   } catch (error) {
//     console.error('Error fetching banners:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



const getBannerss = async (req, res) => {
  try {
    // Fetch banners along with category and supplier info
    const banners = await Banner.find()
      .populate('categoryId', 'name categoryImagePath') // Populate category data: name and categoryImagePath
      .populate('supplierId', 'name companyLogo');      // Populate supplier data: name and companyLogo

    // Extract and format banners
    const bannerData = banners.map((banner, index) => ({
      [`banner${index + 1}`]: {
        id: banner._id,
        bannerImage: `${BASE_URL}/images/bannerImage/${banner.bannerImage}`
      }
    }));

    // Extract and format unique categories
    const uniqueCategories = Array.from(
      new Map(
        banners
          .filter(b => b.categoryId)
          .map(b => [b.categoryId._id.toString(), b.categoryId])
      ).values()
    );
    const categoryData = uniqueCategories.map((category, index) => ({
      [`category${index + 1}`]: {
        id: category._id,
        name: category.name,
        categoryImagePath: `${BASE_URL}/images/categoryImage/${category.categoryImagePath}`
      }
    }));

    // Extract and format unique suppliers
    const uniqueSuppliers = Array.from(
      new Map(
        banners
          .filter(b => b.supplierId)
          .map(b => [b.supplierId._id.toString(), b.supplierId])
      ).values()
    );
    const supplierData = uniqueSuppliers.map((supplier, index) => ({
      [`supplier${index + 1}`]: {
        id: supplier._id,
        name: supplier.name,
        companyLogo: `${BASE_URL}/images/cmpLogo/${supplier.companyLogo}`
      }
    }));

    // Format final response
    const formattedResponse = {
      banner: Object.assign({}, ...bannerData),
      category: Object.assign({}, ...categoryData),
      supplier: Object.assign({}, ...supplierData)
    };

    // Send response
    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// const getAllData = async (req, res) => {
//   try {
//     // Fetch all banners
//     const banners = await Banner.find()
//       .populate('categoryId', 'name categoryImagePath') // Populate category data
//       .populate('supplierId', 'name companyLogo') // Populate supplier data
//       .lean();

//     // Fetch all unique categories
//     const categories = await Category.find().lean(); // Adjust `Category` to your actual model name

//     // Fetch all unique suppliers
//     const suppliers = await Supplier.find().lean(); // Adjust `Supplier` to your actual model name

//     // Format banners
//     const bannerList = banners.map(banner => ({
//       id: banner._id,
//       bannerImage: `http://192.168.1.202:5000/images/bannerImage/${banner.bannerImage}`,
//       category: banner.categoryId ? {
//         id: banner.categoryId._id,
//         name: banner.categoryId.name,
//         categoryImagePath: `http://192.168.1.202:5000/images/categoryImage/${banner.categoryId.categoryImagePath}`
//       } : null,
//       supplier: banner.supplierId ? {
//         id: banner.supplierId._id,
//         name: banner.supplierId.name,
//         companyLogo: `http://192.168.1.202:5000/images/cmpLogo/${banner.supplierId.companyLogo}`
//       } : null
//     }));

//     // Format categories
//     const categoryList = categories.map(category => ({
//       id: category._id,
//       name: category.name,
//       categoryImagePath: `http://192.168.1.202:5000/images/categoryImage/${category.categoryImagePath}`
//     }));

//     // Format suppliers
//     const supplierList = suppliers.map(supplier => ({
//       id: supplier._id,
//       name: supplier.name,
//       companyLogo: `http://192.168.1.202:5000/images/cmpLogo/${supplier.companyLogo}`
//     }));

//     // Final response object
//     const response = {
//       banners: bannerList,
//       categories: categoryList,
//       suppliers: supplierList
//     };

//     // Send response
//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Error fetching all data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// POST /api/admin/banner - Add a new banner



// const getAllData = async (req, res) => {
//   const { q } = req.query;  // Get search query if available

//   try {
//     if (q) {
//       // Search query present, fetch only banners matching the search query
//       const banners = await Banner.find({ bannerImage: { $regex: q, $options: 'i' } })  // Search based on banner image or modify to suit your query logic
//         .lean();

//       const bannerList = banners.map(banner => ({
//         id: banner._id,
//         bannerImage: `http://192.168.1.202:5000/images/bannerImage/${banner.bannerImage}`
//       }));

//       return res.status(200).json({ banners: bannerList });  // Only return banners
//     } else {
//       // No search query, fetch all data (banners, categories, suppliers)

//       // Fetch all banners
//       const banners = await Banner.find()
//         .populate('categoryId', 'name categoryImagePath') // Populate category data
//         .populate('supplierId', 'name companyLogo') // Populate supplier data
//         .lean();

//       // Format banners (exclude category and supplier details in this section)
//       const bannerList = banners.map(banner => ({
//         id: banner._id,
//         bannerImage: `http://192.168.1.202:5000/images/bannerImage/${banner.bannerImage}`
//       }));

//       // Fetch all unique categories (without filtering by query)
//       const categories = await Category.find().lean(); // Adjust `Category` to your actual model name

//       // Fetch all unique suppliers (without filtering by query)
//       const suppliers = await Supplier.find().lean(); // Adjust `Supplier` to your actual model name

//       // Format categories
//       const categoryList = categories.map(category => ({
//         id: category._id,
//         name: category.name,
//         categoryImagePath: `http://192.168.1.202:5000/images/categoryImage/${category.categoryImagePath}`
//       }));

//       // Format suppliers
//       const supplierList = suppliers.map(supplier => ({
//         id: supplier._id,
//         name: supplier.name,
//         companyLogo: `http://192.168.1.202:5000/images/cmpLogo/${supplier.companyLogo}`
//       }));

//       // Final response object without category and supplier data in the banner section
//       const response = {
//         banners: bannerList,
//         categories: categoryList,
//         suppliers: supplierList
//       };

//       return res.status(200).json(response);
//     }
//   } catch (error) {
//     console.error('Error fetching all data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// const getAllData = async (req, res) => {
//   // const { q } = req.query;
//   const { q, page = 1, limit = 10 } = req.query;

//   try {
//     if (q) {
//       const banners = await Banner.find({ bannerImage: { $regex: q, $options: 'i' } }).lean();
//       const bannerList = banners.map(banner => ({
//         name:banner.bannerName,
//         id: banner._id,
//         bannerImage: banner.bannerImage.startsWith('http')
//           ? banner.bannerImage // Use as is if it already starts with "http"
//           : `http://65.2.0.34:5000/images/bannerImage/${banner.bannerImage}`
          

//       }));
//       // return res.status(200).json({ banners: bannerList });
//       return res.status(200).json({ banners: bannerList, totalCount: banners.length });
//     } else {
//       const banners = await Banner.find()
//         .populate('categoryId', 'name categoryImagePath')
//         .populate('supplierId', 'name companyLogo')
//         .lean();

//       const bannerList = banners.map(banner => ({
//         id: banner._id,
//         name:banner.bannerName,

//         bannerImage: banner.bannerImage.startsWith('http')
//           ? banner.bannerImage
//           : `http://65.2.0.34:5000/images/bannerImage/${banner.bannerImage}`
          
//       }));

//       const categories = await Category.find().lean();  
//       const categoryList = categories.map(category => ({
//         id: category._id,
//         name: category.name,
//         categoryImagePath: category.categoryImagePath.startsWith('http')
//           ? category.categoryImagePath
//           : `http://65.2.0.34:5000/images/categoryImage/${category.categoryImagePath}`
          

//       }));

//       const suppliers = await Supplier.find().lean();
//       const supplierList = suppliers.map(supplier => ({
//         id: supplier._id,
//         name: supplier.name,
//         companyLogo: supplier.companyLogo.startsWith('http')
//           ? supplier.companyLogo
//           : `http://65.2.0.34:5000/images/cmpLogo/${supplier.companyLogo}`
         

//       }));

//       const response = {
//         banners: bannerList,
//         categories: categoryList,
//         suppliers: supplierList
//       };

//       return res.status(200).json(response);
//     }
//   } catch (error) {
//     console.error('Error fetching all data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };




const getAllData = async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  try {
    if (q) {
      const banners = await Banner.find({ bannerImage: { $regex: q, $options: 'i' } }).lean();
      const bannerList = banners.map(banner => ({
        // name: banner.bannerName,
        id: banner._id,
        description:banner.description,
        bannerImage : banner.bannerImage
        // bannerImage: banner.bannerImage.startsWith('http')
        //   ? banner.bannerImage
          // : `${BASE_URL}/images/bannerImage/${banner.bannerImage}`,
      }));

      return res.status(200).json({
        pagination: {
          totalCount: banners.length,
          currentPage: 1,
          pageCount: 1,
          perPage: banners.length,
        },
        banners: bannerList,
      });
    } else {
      // Pagination calculation
      const skip = (page - 1) * limit;

      // Fetch banners with pagination
      const bannerQuery = Banner.find()
        // .populate('categoryId', 'name categoryImagePath')
        // .populate('supplierId', 'name companyLogo')
        .skip(skip)
        .limit(limit)
        .lean();
      const totalBanners = await Banner.countDocuments();

      const banners = await bannerQuery;
      const bannerList = banners.map(banner => ({
        id: banner._id,
        // name: banner.bannerName,
        description:banner.description,
        bannerImage: banner.bannerImage.startsWith('http')
          ? banner.bannerImage
          : `${BASE_URL}/images/bannerImage/${banner.bannerImage}`,
      }));

      // Fetch all categories and suppliers
      const [categories, suppliers] = await Promise.all([
        Category.find().lean(),
        Supplier.find().lean(),
      ]);

      // const categoryList = categories.map(category => ({
      //   id: category._id,
      //   name: category.name,
      //   categoryImagePath: category.categoryImagePath.startsWith('http')
      //     ? category.categoryImagePath
      //     : `${BASE_URL}/images/categoryImage/${category.categoryImagePath}`,
      // }));

      // const supplierList = suppliers.map(supplier => ({
      //   id: supplier._id,
      //   name: supplier.companyName,
      //   companyLogo: supplier.companyLogo.startsWith('http')
      //     ? supplier.companyLogo
      //     : `${BASE_URL}/images/cmpLogo/${supplier.companyLogo}`
      // }));
     

      const categoryList = categories.map(category => ({
        id: category._id,
        name: category.name,
        categoryImagePath: category.categoryImagePath
          ? (category.categoryImagePath.startsWith('http')
              ? category.categoryImagePath
              : `${BASE_URL}/images/categoryImage/${category.categoryImagePath}`)
          : null, // Handle null or empty case
    }));
    
    const supplierList = suppliers.map(supplier => ({
        id: supplier._id,
        name: supplier.companyName,
        companyLogo: supplier.companyLogo
          ? (supplier.companyLogo.startsWith('http')
              ? supplier.companyLogo
              : `${BASE_URL}/images/cmpLogo/${supplier.companyLogo}`)
          : null, // Handle null or empty case
    }));
    
      
      // Create response with pagination at the top
      return res.status(200).json({
        pagination: {
          bannerCount: totalBanners,
          categoryCount: categories.length,
          supplierCount: suppliers.length,
          pageCount: Math.ceil(totalBanners / limit),
          currentPage: parseInt(page, 10),
          perPage: parseInt(limit, 10),
        },
        data: {
          banners: bannerList,
          categories: categoryList,
          suppliers: supplierList,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching all data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// const createBanner = async (req, res) => {
//   const { bannerName,bannerImage, categoryId, supplierId } = req.body;

//   try {
//     // Create a new banner
//     const newBanner = new Banner({
//       bannerName,
//       bannerImage,
//       categoryId,
//       supplierId,
//     });

//     // Save the banner
//     await newBanner.save();

//     res.status(201).json({ message: 'Banner created successfully', banner: newBanner });
//   } catch (error) {
//     console.error('Error creating banner:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };





//--------------------1----------------UPLOAD IMAGE THROGH FORM-DATA----------------------------------


// // Ensure the directory exists before saving files
// const ensureDirectoryExists = (directory) => {
//   if (!fs.existsSync(directory)) {
//     fs.mkdirSync(directory, { recursive: true });
//   }
// };

// // Configure storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // const uploadPath = 'uploads/banners/'; // Custom subdirectory for banners
    
//     const uploadPath = 'images/bannerImage/'; // Custom subdirectory for banners
    
//     ensureDirectoryExists(uploadPath); // Ensure directory exists before saving files
//     cb(null, uploadPath); // Set the destination for file storage
//   },
//   filename: (req, file, cb) => {
//     const originalName = file.originalname; // Use the original filename
//     cb(null, originalName); // Use the original file name
//   }
// });

// // Filter to allow only image files
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /jpeg|jpg|png/;
//   const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedFileTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true); // Allow the file
//   } else {
//     cb(new Error('Only images are allowed')); // Reject the file
//   }
// };

// // Initialize multer
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5 MB size limit
// });

// // Route handler to create a banner
// const createBanner = async (req, res) => {
//   try {
//     // Handle file upload
//     upload.single('bannerImage')(req, res, async (err) => {
//       if (err) {
//         return res.status(400).json({ message: err.message });
//       }

//       const { bannerName } = req.body;

//       // Check for required fields
//       if (!bannerName || !req.file) {
//         return res.status(400).json({ message: 'Banner name and image are required' });
//       }

//       // Construct the full URL for the uploaded banner image using the original filename
//       const bannerImagePath = `${BASE_URL}/images/bannerImage/${req.file.filename}`;
      

//       // Create a new banner object
//       const newBanner = new Banner({
//         bannerName,
//         bannerImage: bannerImagePath // Append base URL to the file path
//       });

//       // Save the banner to the database
//       const savedBanner = await newBanner.save();

//       // Return success response
//       res.status(201).json({
//         message: 'Banner created successfully',
//         banner: savedBanner
//       });
//     });
//   } catch (error) {
//     console.error('Error creating banner:', error);
//     res.status(500).json({
//       message: 'Error creating banner',
//       error: error.message
//     });
//   }
// };

//---------------------------------------------2-------------------------

// Helper to ensure directory exists
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'images/bannerImage/'; // Directory for storing banner images
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`; // Replace spaces in filenames for safety
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Allow the file
  } else {
    cb(new Error('Only JPEG, JPG, and PNG images are allowed')); // Reject unsupported files
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Route Handler
const createBanner = async (req, res) => {
  upload.single('bannerImage')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message }); // Handle Multer errors
    }

    try {
      const { description } = req.body;
      console.log("banner name:  ",description);
      console.log('file name', req.file);
      

      // Validate inputs
      if (!description || !req.file) {
        return res.status(400).json({ message: 'Banner description and image are required' });
      }

      // Construct the banner image path
      const bannerImagePath = `${BASE_URL}/images/bannerImage/${req.file.filename}`;
      console.log("bannerImagePath----",bannerImagePath);
      
      // Save banner to database
      const newBanner = new Banner({
        description,
        bannerImage: bannerImagePath,
      });

      const savedBanner = await newBanner.save();

      res.status(201).json({
        message: 'Banner created successfully',
        banner: savedBanner,
      });
    } catch (error) {
      console.error('Error creating banner:', error);
      res.status(500).json({ message: 'Error creating banner', error: error.message });
    }
  });
};

//=================================================================================

module.exports = {
  getBanners,
  createBanner,getBannerss,getAllData
};
