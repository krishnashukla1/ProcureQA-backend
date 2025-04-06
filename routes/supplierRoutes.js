const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);

router.post('/', supplierController.createSupplier);   // FOR CREATE SUPPLIER USE  http://localhost:5000/api/admin/suppliers/    URL FOR POST
router.put('/:id', supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

router.get('/search/name', supplierController.getSuppliersByName);


router.post('/suppliers', supplierController.insertSupplier);  //FOR INSERT SUPPLIER USE http://localhost:5000/api/admin/suppliers/suppliers  URL FOR POST
router.get('/name/logo', supplierController.getSuppliers);  


router.get('/search/q', supplierController.getSuppliersbyQuery);





module.exports = router;

// http://localhost:5000/api/admin/suppliers/search/name?name=big

