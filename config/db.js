const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;





/* -------------------Mysql-----------------------------------------


const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',       // Database host
    user: 'root',            // Database user
    password: 'root',        // Database password
    database: 'bigtrader'    // Database name
});

// Create a function to connect to the database
const connectDB = () => {
    return new Promise((resolve, reject) => {
        connection.connect((error) => {
            if (error) {
                console.error('Error connecting to the database:', error.message);
                return reject(error); // Reject the promise on error
            } 
            console.log('Connected to the MySQL database.');
            resolve(); // Resolve the promise on successful connection
        });
    });
};

// Export the connection and the connectDB function
module.exports = { connection, connectDB };

*/