const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');
const Inspect = require('./inspectSchema');
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
  Inspect.find({
    Job_Num: req.query.Job_Num,
    Part_Num: req.query.Part_Num,
    Date: req.query.Date,
    Due_Date: req.query.Due_Date,
    Description: req.query.Description,
    Quantity_to_Ship: req.query.Quantity_to_Ship,
    MaterialQuality: req.query.Material,
  }, (err, inspect) => {
    if (err || inspect.length <= 0) return res.json({
      success: false,
      error: err
    });
    console.log('hit');
    var token = jwt.sign(
      { Job_Num: inspect.Job_Num },
      'thisIsAInventoryManagementSystem123',
      { expiresIn: 120}
    );

    res.send(token);
  });
});

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Inspect.find({
    Job_Num: req.query.Job_Num,
    Part_Num: req.query.Part_Num,
    Date: req.query.Date,
    Due_Date: req.query.Due_Date,
    Description: req.query.Description,
    Quantity_to_Ship: req.query.Quantity_to_Ship,
    MaterialQuality: req.query.Material,
  }, (err, inspect) => {
    if (err || inspect.length <= 0) return res.json({
      success: false,
      shift: inspect.length,
      error: err
    });
    return res.json({
      success: true,
      inspect: inspect.length,
      inspect: inspect
    });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { jobNum, partNum, date, dueDate, description,
  quantityToShip, materialQuality } = req.query;
  if (jobNum === undefined) return res.json({
    success: false,
    jobNum: undefined
  });
  Inspect.findOne({ jobNum: jobNum }, (err, inspect) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    if (req.query.Job_Num != undefined) inspect.Job_Num = jobNum;
    if (req.query.Part_Num != undefined) inspect.Part_Num = partNum;
    if (req.query.Date != undefined) inspect.Date = date;
    if (req.query.Due_Date != undefined) inspect.Due_Date = dueDate;
    if (req.query.Description != undefined) inspect.Description = description;
    if (req.query.Quantity_to_Ship != undefined) inspect.Quantity_to_Ship = quantityToShip;
    if (req.query.MaterialQuality != undefined) inspect.MaterialQuality = materialQuality;
    inspect.save();
    return res.json({
      success: true,
      updatedInspect: inspect
    });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const jobNum = req.query.Job_Num;
  Inspect.findOne({ 'jobNum': jobNum }, (err, inspect) => {
    if (err) return handleError(err);
    //if (job.permission === "admin") {
      Inspect.findOneAndDelete(jobNum, (err) => {
        if (err) return res.json({
          success: false,
          error: err
        });
        return res.json({
          success: true,
          removedInspect: jobNum
        });
      });
    //}
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let inspect = new inspect();
  const { jobNum, partNum, date, dueDate, description,
  quantityToShip, materialQuality } = req.query;
  inspect.Job_Num = jobNum;
  inspect.Part_Num = partNum;
  inspect.Date = date;
  inspect.Due_Date = dueDate;
  inspect.Description = description;
  inspect.Quantity_to_Ship = quantityToShip;
  inspect.MaterialQuality = materialQuality;
  inspect.save((err) => {
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
