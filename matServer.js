const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');
const Material = require('./matSchema');
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
  Material.find({
    Job_Num: req.query.Job_Num,
    matName: req.query.matName,
    matType: req.query.matType,
    isTool: req.query.isTool,
    isMatieral: req.query.isMatieral,
    matQuantity: req.query.Quantity,
    matLength: req.query.matLength,
    matWidth: req.query.matWidth,
    matHeight: req.query.matHeight,
  }, (err, material) => {
    if (err || material.length <= 0) return res.json({
      success: false,
      error: err
    });
    console.log('hit');
    var token = jwt.sign(
      { matName: customer.matName },
      'thisIsAInventoryManagementSystem123',
      { expiresIn: 120}
    );

    res.send(token);
  });
});

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Material.find({
    Job_Num: req.query.Job_Num,
    matName: req.query.matName,
    matType: req.query.matType,
    isTool: req.query.isTool,
    isMatieral: req.query.isMatieral,
    matQuantity: req.query.Quantity,
    matLength: req.query.matLength,
    matWidth: req.query.matWidth,
    matHeight: req.query.matHeight,
  }, (err, material) => {
    if (err || material.length <= 0) return res.json({
      success: false,
      material: material.length,
      error: err
    });
    return res.json({
      success: true,
      material: material.length,
      material: material
    });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { jobNum, matName, matType, isTool, isMatieral,
  matQuantity, matLength, matWidth, matHeight } = req.query;
  if (matName === undefined) return res.json({
    success: false,
    matName: undefined
  });
  Material.findOne({ matName: matName }, (err, material) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    if (req.query.Job_Num != undefined) material.Job_Num = jobNum;
    if (req.query.matName != undefined) material.matName = matName;
    if (req.query.matType != undefined) material.matType = matType;
    if (req.query.isTool != undefined) material.isTool = isTool;
    if (req.query.isMatieral != undefined) material.isMatieral = isMatieral;
    if (req.query.matQuantity != undefined) material.matQuantity = matQuantity;
    if (req.query.matLength != undefined) material.matLength = matLength;
    if (req.query.matWidth != undefined) material.matWidth = matWidth;
    if (req.query.matHeight != undefined) material.matHeight = matHeight;
    material.save();
    return res.json({
      success: true,
      updatedMaterial: material
    });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const matName = req.query.matName;
  Material.findOne({ 'matName': matName }, (err, material) => {
    if (err) return handleError(err);
    //if (job.permission === "admin") {
      Material.findOneAndDelete(matName, (err) => {
        if (err) return res.json({
          success: false,
          error: err
        });
        return res.json({
          success: true,
          removedMaterial: matName
        });
      });
    //}
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let material = new material();
  const { jobNum, matName, matType, isTool, isMatieral,
  matQuantity, matLength, matWidth, matHeight } = req.query;
  material.Job_Num = jobNum;
  material.matName = matName;
  material.matType = matType;
  material.isTool = isTool;
  material.isMatieral = isMatieral;
  material.matQuantity = matQuantity;
  material.matLength = matLength;
  material.matWidth = matWidth;
  material.matHeight = matHeight;
  material.save((err) => {
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
