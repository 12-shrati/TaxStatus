const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const authenticate = require('./auth');

const taxController = require('./controllers/taxController')


// User Api
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/user/:userId/profile',authenticate.authenticateUser,userController.getUser);


// tax api

router.post('/createTax',taxController.userTaxCreation)
router.get('/taxDetails/:userId',taxController.getTaxDetailsByUserId)
router.get('/taxDeatails',taxController.getTaxDetailsFiltres)
router.put('/createTax/:userId',taxController.markTaxPaid)
router.put('/createTax/:userId',taxController.createAndEditTaxDue)
router.put('/createTax/:userId',taxController.editTaxPayer)


module.exports = router;

