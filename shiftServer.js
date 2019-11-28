const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');
const Shift = require('./shiftSchema');
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
  Shift.find({
    Job_Num: req.query.Job_Num,
    Part_Num: req.query.Part_Num,
    button_to_button_time: req.query.button_to_button_time,
    machine_time: req.query.machine_time,
    Parts_Sampled: req.query.Parts_Sampled,
    Date: req.query.Date,
    ShiftNotes: req.query.ShiftNotes,
  }, (err, shift) => {
    if (err || shift.length <= 0) return res.json({
      success: false,
      error: err
    });
    console.log('hit');
    var token = jwt.sign(
      { Job_Num: shift.Job_Num },
      'thisIsAInventoryManagementSystem123',
      { expiresIn: 120}
    );

    res.send(token);
  });
});

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Shift.find({
    Job_Num: req.query.Job_Num,
    Part_Num: req.query.Part_Num,
    button_to_button_time: req.query.button_to_button_time,
    machine_time: req.query.machine_time,
    Parts_Sampled: req.query.Parts_Sampled,
    Date: req.query.Date,
    ShiftNotes: req.query.ShiftNotes,
  }, (err, shift) => {
    if (err || shift.length <= 0) return res.json({
      success: false,
      shift: shift.length,
      error: err
    });
    return res.json({
      success: true,
      shift: shift.length,
      shift: shift
    });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { jobNum, partNum, buttonTime, machineTime, partsSampled,
  date, shiftNotes } = req.query;
  if (jobNum === undefined) return res.json({
    success: false,
    jobNum: undefined
  });
  Shift.findOne({ jobNum: jobNum }, (err, shift) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    if (req.query.Job_Num != undefined) shift.Job_Num = jobNum;
    if (req.query.Part_Num != undefined) shift.Part_Num = partNum;
    if (req.query.button_to_button_time != undefined) shift.button_to_button_time = buttonTime;
    if (req.query.machine_time != undefined) shift.machine_time = machineTime;
    if (req.query.Parts_Sampled != undefined) shift.Parts_Sampled = partsSampled;
    if (req.query.Date != undefined) shift.Date = date;
    if (req.query.ShiftNotes != undefined) shift.ShiftNotes = shiftNotes;
    shift.save();
    return res.json({
      success: true,
      updatedShift: shift
    });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const jobNum = req.query.Job_Num;
  Shift.findOne({ 'jobNum': jobNum }, (err, shift) => {
    if (err) return handleError(err);
    //if (job.permission === "admin") {
      Shift.findOneAndDelete(jobNum, (err) => {
        if (err) return res.json({
          success: false,
          error: err
        });
        return res.json({
          success: true,
          removedShift: jobNum
        });
      });
    //}
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let shift = new shift();
  const { jobNum, partNum, buttonTime, machineTime, partsSampled,
  date, shiftNotes } = req.query;
  shift.Job_Num = jobNum;
  shift.Part_Num = partNum;
  shift.button_to_button_time = buttonTime;
  shift.machine_time = machineTime;
  shift.Parts_Sampled = partsSampled;
  shift.Date = date;
  shift.ShiftNotes = shiftNotes;
  shift.save((err) => {
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
