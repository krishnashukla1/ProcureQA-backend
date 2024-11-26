
/*

const Client = require('../models/client.js');
const validator = require('validator');



const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createClient = async (req, res) => {
//   const { name, companyName, phoneNo, email } = req.body;
//   try {
   
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }


//     const phoneRegex = /^(\d{3})\s(\d{8})$/;
//     if (!phoneRegex.test(phoneNo)) {
//       return res.status(400).json({ message: 'Phone number must be in the format "xxx xxxxxxxx"' });
//     }

//     const newClient = await Client.create({ name, companyName, phoneNo, email });
//     res.status(201).json(newClient);

//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


const createClient = async (req, res) => {
  
    const { name, companyName, phoneNo, email,productCode,supplierCode } = req.body;

  try {
    // Check if all required fields are present
    if (!name || !companyName || !phoneNo || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone number format (e.g., "123 45678901")
    // const phoneRegex = /^\d{3}\s\d{8}$/;
    // if (!phoneRegex.test(phoneNo)) {
    //   return res.status(400).json({ message: 'Phone number must be in the format "xxx xxxxxxxx"' });
    // }



    const phoneRegex = /^\+974\s\d{8}$/;
    if (!phoneRegex.test(phoneNo)) {
        return res.status(400).json({ message: 'Phone number must be in the format "+974 xxxxxxxx"' });
    }


    // Check if the email already exists in the database
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(409).json({ message: 'Client with this email already exists' });
    }

    // Create a new client
    const newClient = await Client.create({ name, companyName, phoneNo, email ,productCode,supplierCode});
    res.status(201).json(newClient);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedClient) {
      res.json(updatedClient);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (deletedClient) {
      res.json({ message: 'Client deleted successfully' });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient, updateClient, deleteClient
};

*/




const Client = require('../models/client'); // Update with your file path
const Product = require('../models/product'); // Update with your file path
const SubCategory = require('../models/subCategory'); // Update with your file path
const Supplier = require('../models/supplier'); // Update with your file path
const validator = require('validator'); // Ensure you have this installed

// const createClient = async (req, res) => {
//   const { name, companyName, phoneNo, email, product, subCategory, supplier } = req.body;

//   try {
//     // Check if all required fields are present
//     if (!name || !companyName || !phoneNo || !email) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Validate email format
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }

//     // Validate phone number format (e.g., "+974 xxxxxxxx")
//     const phoneRegex = /^\+974\s\d{8}$/;
//     if (!phoneRegex.test(phoneNo)) {
//       return res.status(400).json({ message: 'Phone number must be in the format "+974 xxxxxxxx"' });
//     }

//     // Validate ObjectIds for product, subCategory, and supplier
//     if (product && !(await Product.findById(product))) {
//       return res.status(404).json({ message: 'Invalid Product ID' });
//     }
//     if (subCategory && !(await SubCategory.findById(subCategory))) {
//       return res.status(404).json({ message: 'Invalid SubCategory ID' });
//     }
//     if (supplier && !(await Supplier.findById(supplier))) {
//       return res.status(404).json({ message: 'Invalid Supplier ID' });
//     }

//     // Check if the email already exists in the database
//     const existingClient = await Client.findOne({ email });
//     if (existingClient) {
//       return res.status(409).json({ message: 'Client with this email already exists' });
//     }

//     // Create a new client
//     const newClient = await Client.create({ name, companyName, phoneNo, email, product, subCategory, supplier });
//     res.status(201).json(newClient);



//     // Fetch and populate itemCode
//     const populatedClient = await Client.findById(newClient._id).populate({
//       path: 'itemCode', // Virtual field
//       select: 'ItemCode', // Include only the ItemCode field
//     });

//     res.status(201).json(populatedClient);



//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };





const createClient = async (req, res) => {
  const { name, companyName, phoneNo, email, product, subCategory, supplier } = req.body;

  try {
    // Validate required fields
    if (!name || !companyName || !phoneNo || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone number format
    const phoneRegex = /^\+974\s\d{8}$/;
    if (!phoneRegex.test(phoneNo)) {
      return res.status(400).json({ message: 'Phone number must be in the format "+974 xxxxxxxx"' });
    }

    // Validate related IDs
    if (product && !(await Product.findById(product))) {
      return res.status(404).json({ message: 'Invalid Product ID' });
    }
    if (subCategory && !(await SubCategory.findById(subCategory))) {
      return res.status(404).json({ message: 'Invalid SubCategory ID' });
    }
    if (supplier && !(await Supplier.findById(supplier))) {
      return res.status(404).json({ message: 'Invalid Supplier ID' });
    }

    // Check if the email already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(409).json({ message: 'Client with this email already exists' });
    }

    // Create a new client
    const newClient = await Client.create({ name, companyName, phoneNo, email, product, subCategory, supplier });

    // Populate the product reference to include the itemCode
    const populatedClient = await Client.findById(newClient._id).populate({
      path: 'product', // Populate the 'product' field
      select: 'ItemCode', // Include only 'ItemCode' from Product
    });

    res.status(201).json(populatedClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// const getAllClients = async (req, res) => {
//   try {
//     const clients = await Client.find();
//     res.json(clients);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getAllClients = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default page=1, limit=10

  try {
    // Parse query parameters to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Pagination logic
    const skip = (pageNum - 1) * limitNum;

    // Fetch clients with pagination
    const clients = await Client.find().skip(skip).limit(limitNum).lean();

    // Count total clients
    const totalClients = await Client.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalClients / limitNum);

    // Build response with metadata
    res.status(200).json({
      pagination: {
        totalClients,
        currentPage: pageNum,
        perPage: limitNum,
        totalPages,
      },
      clients,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createClient,getAllClients };
