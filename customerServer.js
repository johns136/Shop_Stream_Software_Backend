const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');
const Customer = require('./customerSchema');
var jwt = require('jsonwebtoken');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://127.0.0.1:27017/UserAuth';

// connects our back end code with the database
mongoose.connect(dbRoute, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
let db = mongoose.connection;

// connect to the database
db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// use the morgon logger to log the api requests
app.use(logger('dev'));

// this method will send a authentication token back to the client if
// the user and password are correct.
router.get('/authenticate', (req, res) => {
  Customer.find({
    theBuyer: req.query.Buyer,
    theCompany: req.query.Company,
    theEmail: req.query.Email,
    thePhone: req.query.Phone,
  }, (err, customer) => {
    if (err || customer.length <= 0) return res.json({
      success: false,
      error: err
    });
    console.log('hit');
    var token = jwt.sign(
      { Buyer: customer.Buyer },
      'thisIsAInventoryManagementSystem123',
      { expiresIn: 120}
    );

    res.send(token);
  });
});

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Customer.find({
    theBuyer: req.query.Buyer,
    theCompany: req.query.Company,
    theEmail: req.query.Email,
    thePhone: req.query.Phone,
  }, (err, customer) => {
    if (err || customer.length <= 0) return res.json({
      success: false,
      customer: customer.length,
      error: err
    });
    return res.json({
      success: true,
      customer: customer.length,
      customer: customer
    });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { buyer, Company, Email, Phone } = req.query;
  if (buyer === undefined) return res.json({
    success: false,
    Buyer: undefined
  });
  Customer.findOne({ Buyer: buyer }, (err, customer) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    if (req.query.Buyer != undefined) customer.Buyer = theBuyer;
    if (req.query.Company != undefined) customer.Company = theCompany;
    if (req.query.Email != undefined) customer.Email = theEmail;
    if (req.query.Phone != undefined) customer.Phone = thePhone;
    customer.save();
    return res.json({
      success: true,
      updatedCustomer: customer
    });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const theBuyer = req.query.Buyer;
  Customer.findOne({ 'buyer': theBuyer }, (err, customer) => {
    if (err) return handleError(err);
    //if (job.permission === "admin") {
      Customer.findOneAndDelete(theBuyer, (err) => {
        if (err) return res.json({
          success: false,
          error: err
        });
        return res.json({
          success: true,
          removedCustomer: theBuyer
        });
      });
    //}
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let customer = new customer();
  const { buyer, Company, Email, Phone } = req.query;
  customer.Buyer = theBuyer;
  customer.Company = theCompany;
  customer.Email = theEmail;
  customer.Phone = thePhone;
  customer.save((err) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    return res.json({
      success: true
    });
  });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
