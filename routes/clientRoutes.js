// import express from 'express';
const express =require('express');

const {
  getAllClients,
  // getClientById,
  createClient,
  // updateClient,
  // deleteClient,
} = require ('../controllers/clientController.js');

const router = express.Router();

router.get('/', getAllClients); 
// router.get('/:id', getClientById);
router.post('/', createClient); 
// router.put('/:id', updateClient); 
// router.delete('/:id', deleteClient); 

module.exports = router;
