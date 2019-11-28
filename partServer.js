const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');
const part = require('./partSchema');
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
  Part.find({
    Job_Num: req.query.Job_Num,
    Part_Num: req.query.Part_Num,
    button_to_button_time: req.query.button_to_button_time,
    machine_time: req.query.machine_time,
    partDescription: req.query.partDescription,
    ToolNotes: req.query.ToolNotes,
    ViceNotes: req.query.ViceNotes,
    Scraps: req.query.Scraps,
  }, (err, part) => {
    if (err || part.length <= 0) return res.json({
      success: false,
      error: err
    });
    console.log('hit');
    var token = jwt.sign(
      { Job_Num: part.Job_Num },
      'thisIsAInventoryManagementSystem123',
      { expiresIn: 120}
    );

    res.send(token);
  });
});

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Part.find({
    Job_Num: req.query.Job_Num,
    Part_Num: req.query.Part_Num,
    button_to_button_time: req.query.button_to_button_time,
    machine_time: req.query.machine_time,
    partDescription: req.query.partDescription,
    ToolNotes: req.query.ToolNotes,
    ViceNotes: req.query.ViceNotes,
    Scraps: req.query.Scraps,
  }, (err, part) => {
    if (err || part.length <= 0) return res.json({
      success: false,
      part: part.length,
      error: err
    });
    return res.json({
      success: true,
      part: part.length,
      part: part
    });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { jobNum, partNum, buttonTime, machineTime, partDescription,
  toolNotes, viceNotes, scraps } = req.query;
  if (jobNum === undefined) return res.json({
    success: false,
    jobNum: undefined
  });
  Part.findOne({ jobNum: jobNum }, (err, material) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    if (req.query.Job_Num != undefined) part.Job_Num = jobNum;
    if (req.query.Part_Num != undefined) part.Part_Num = partNum;
    if (req.query.button_to_button_time != undefined) part.button_to_button_time = buttonTime;
    if (req.query.machine_time != undefined) part.machine_time = machineTime;
    if (req.query.partDescription != undefined) part.partDescription = partDescription;
    if (req.query.ToolNotes != undefined) part.ToolNotes = toolNotes;
    if (req.query.ViceNotes != undefined) part.ViceNotes = viceNotes;
    if (req.query.Scraps != undefined) part.Scraps = scraps;
    part.save();
    return res.json({
      success: true,
      updatedPart: part
    });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const jobNum = req.query.Job_Num;
  Part.findOne({ 'jobNum': jobNum }, (err, part) => {
    if (err) return handleError(err);
    //if (job.permission === "admin") {
      Part.findOneAndDelete(jobNum, (err) => {
        if (err) return res.json({
          success: false,
          error: err
        });
        return res.json({
          success: true,
          removedPart: jobNum
        });
      });
    //}
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let part = new part();
  const { jobNum, partNum, buttonTime, machineTime, partDescription,
  toolNotes, viceNotes, scraps } = req.query;
  part.Job_Num = jobNum;
  part.Part_Num = partNum;
  part.button_to_button_time = buttonTime;
  part.machine_time = machineTime;
  part.partDescription = partDescription;
  part.ToolNotes = toolNotes;
  part.ViceNotes = viceNotes;
  part.Scraps = scraps;
  part.save((err) => {
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
