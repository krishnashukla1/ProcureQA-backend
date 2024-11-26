const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/admin/products', require('./routes/productRoutes'));
app.use('/api/admin/suppliers', require('./routes/supplierRoutes'));
app.use('/api/admin', require('./routes/userRoutes'));
app.use('/api/admin/cat', require('./routes/categoryRoutes'));
app.use('/api/admin/sub', require('./routes/subcategoryRoutes'));


app.use('/api/category', require('./routes/categoryRoutes'));

app.use('/api/suppliers', require('./routes/supplierRoutes'));


// app.use('/api/admin', require('./routes/searchRoutes'));

app.use('/api', require('./routes/search2Routes'));
// http://localhost:5000/apii/itemcode/search?q=3m


app.use('/api/admin/clients', require('./routes/clientRoutes'));

app.use('/api/admin/clientHistory', require('./routes/clientHistoryRoutes'))

app.use('/api/home', require('./routes/bannerRoutes'))


// Serve static files from the 'images' folder

// console.log('Static files served from:', path.join(__dirname, 'images'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images', express.static(path.join(__dirname, 'images', 'cmpLogos')));
app.use('/uploads', express.static('uploads'));





const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0',() => console.log(`Server running on port ${PORT}`));

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;
module.exports = app;


