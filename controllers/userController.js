// const User = require('../models/user');
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');


const signup = async (req, res) => {
    const { username, email, password, role, phoneNumber } = req.body;

    try {
        // Validate username (must be alphanumeric and between 3 to 20 characters)
        const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
        if (!username || !usernameRegex.test(username)) {
            return res.status(400).json({
                message: 'Username must be alphanumeric and between 3 to 20 characters long and without any space.',
            });
        }

        // Validate email using validator
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.and no any space',
            });
        }

        // Validate role (must be either 'Admin' or 'Sales')
        const validRoles = ['Admin', 'Sales'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Role must be either "Admin" or "Sales"' });
        }

        // Validate phone number format (e.g., '974 55568329')
        // const phoneRegex = /^(\d{3})\s(\d{8})$/;
        // if (!phoneRegex.test(phoneNumber)) {
        //     return res.status(400).json({ message: 'Phone number must be in the format "xxx xxxxxxxx"' });
        // }


        const phoneRegex = /^\+974\s\d{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ message: 'Phone number must be in the format "+974 xxxxxxxx"' });
        }
        

        // Check if the user already exists by email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Check if the username is already taken
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10); //The 10 is the number of salt rounds and controls the complexity of the hashing process. A higher value increases security but may slow down the operation.

        // Create a new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            phoneNumber,
        });

        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 'Infinity' });     //never expire token but it is risky


        // Send response with success message and token
        res.status(200).json({
            code: 200,
            error: false,
            message: `${email} successfully added.`,
            token,
            createdAt: user.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            updatedAt: user.updatedAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        });

        console.log('Signup successful, user added to database');
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            code: 500,
            error: true,
            message: 'Server error' 
        
        });
    }
};


// const getUsers = async (req, res) => {
//     try {
//         const { email, sortBy, page = 1, perPage = 100 } = req.query;

//         // Build the filter object based on query parameters
//         const filter = {};
//         if (email) {
//             // Using regex for case-insensitive email search
//             filter.email = { $regex: email, $options: 'i' };
//         }

//         // Define sorting options
//         let sortOptions = {};
//         if (sortBy) {
//             const [field, order] = sortBy.split(':');
//             sortOptions[field] = order === 'desc' ? -1 : 1;
//         }

//         // Calculate the skip value based on page and perPage
//         const skip = (page - 1) * perPage;

//         // Fetch users from the database with filtering, sorting, and pagination
//         const users = await User.find(filter, '-password')
//             .sort(sortOptions)
//             .skip(skip) // Skip records based on the current page
//             .limit(parseInt(perPage)); // Limit the number of records based on perPage

//         // Fetch the total count of users matching the filter
//         const totalUsers = await User.countDocuments(filter);

//         // Calculate total pages
//         const totalPages = Math.ceil(totalUsers / perPage);

//         // Check if users are found
//         if (!users || users.length === 0) {
//             return res.status(404).json({ message: 'No users found' });
//         }

//         // Send response with users data and pagination info
//         res.status(200).json({
//             users,
//             totalUsers,
//             totalPages,
//             currentPage: parseInt(page),
//             perPage: parseInt(perPage)
//         });
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


const getUsers = async (req, res) => {
    try {
        const { email, sortBy, page = 1, perPage = 10 } = req.query;

        // Build the filter object based on query parameters
        const filter = {};
        if (email) {
            // Using regex for case-insensitive email search
            filter.email = { $regex: email, $options: 'i' };
        }

        // Define sorting options
        let sortOptions = {};
        if (sortBy) {
            const [field, order] = sortBy.split(':');
            sortOptions[field] = order === 'desc' ? -1 : 1;
        }

        // Calculate the skip value based on page and perPage
        const skip = (parseInt(page, 10) - 1) * parseInt(perPage, 10);

        // Fetch users from the database with filtering, sorting, and pagination
        const users = await User.find(filter, '-password')
            .sort(sortOptions)
            .skip(skip) // Skip records based on the current page
            .limit(parseInt(perPage, 10)); // Limit the number of records based on perPage

        // Fetch the total count of users matching the filter
        const totalUsers = await User.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(totalUsers / perPage);

        // Format the response
        const response = {
            code: 200,
            error: false,
            message: 'Users fetched successfully',
            pagination: {
                totalElements: totalUsers,
                totalPages,
                size: parseInt(perPage, 10),
                pageNo: parseInt(page, 10),
                numberOfElements: users.length
            },
            data: {
                users
            }
        };

        // Send response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            code: 500,
            error: true,
            message: 'Server error',
            pagination: null,
            data: null
        });
    }
};


const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from URL parameters
        const { username, email, password, role, phoneNumber } = req.body; // Get new details from request body

        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate username (if provided)
        if (username) {
            const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    message: 'Username must be alphanumeric and between 3 to 20 characters long and without any space.',
                });
            }

            // Check if the username is already taken by another user
            const usernameExists = await User.findOne({ username });
            if (usernameExists && usernameExists._id.toString() !== id) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
            user.username = username; // Update username
        }

        // Validate email format (if provided)
        if (email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            // Check if email is already in use (excluding the current user's email)
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists._id.toString() !== id) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            user.email = email; // Update email
        }

        // Validate role (if provided)
        if (role) {
            const validRoles = ['Admin', 'Sales'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: 'Role must be either "Admin" or "Sales"' });
            }
            user.role = role; // Update role
        }

        // Validate phone number format (if provided)
        if (phoneNumber) {




            // const phoneRegex = /^(\d{3})\s(\d{8})$/;
            // if (!phoneRegex.test(phoneNumber)) {
            //     return res.status(400).json({ message: 'Phone number must be in the format "974 55568329"' });
            // }


            const phoneRegex = /^\+974\s\d{8}$/;
            if (!phoneRegex.test(phoneNumber)) {
                return res.status(400).json({ message: 'Phone number must be in the format "+974 xxxxxxxx"' });
            }




            user.phoneNumber = phoneNumber; // Update phone number
        }

        // Update password if provided
        if (password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    message: 'Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
                });
            }
            const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
            user.password = await bcrypt.hash(password, salt); // Hash the password before saving
        }

        // Save the updated user
        await user.save();

        // Send success response
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                updatedAt: user.updatedAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            }
        });
    } catch (error) {
        console.error(error);
        // Return a 500 Internal Server Error for unexpected issues
        res.status(500).json({ message: 'Failed to update user, please try again later' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Get the user ID from URL parameters

        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user by ID
        await User.findByIdAndDelete(id);

        // Send success response
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        // Return a 500 Internal Server Error for unexpected issues
        res.status(500).json({ message: 'Failed to delete user, please try again later' });
    }
};



// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                
                code: 400,
                error: true,
                message: 'Invalid email or password',
                data: null
            });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                code: 400,
                error: true,
                message: 'Invalid email or password',
                data: null

            
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Get the current login time
        // const loginTime = new Date().toISOString();

        // Get the current login time in IST
        const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Send response with success message, token, and login time
        res.status(200).json({
            
            // message: 'Login successful', token, loginTime });


            code: 200,
            error: false,
            message: 'Login successful',
            data: {
                token,
                loginTime
            }
        });

        console.log('Login successful');

    } catch (error) {
        console.error(error);
        res.status(500).json({
            
            code: 500,
            error: true,
            message: 'Server error',
            data: null
        
        });
    }
};

module.exports = { signup,getUsers, updateUser,deleteUser, login };
