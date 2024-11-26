// // authMiddleware.js
// const jwt = require('jsonwebtoken');

// const authMiddleware = async (req, res, next) => {
//     console.log(req.headers);  // Add this for debugging
// // const token = req.header('Authorization')?.replace('Bearer ', '');

//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: 'Invalid token' });
//     }
// };

// module.exports = { authMiddleware }; // Ensure this is exported correctly
