const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');
const Job = require('./jobschema');
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
  Job.find({
    orderDate: req.query.OrderDate,
    dueDate: req.query.Due_Date,
    poNum: req.query.PO_Num,
    jobNum: req.query.Job_Num,
    partNum: req.query.Part_Num,
    orderQuant: req.query.Order_Qty,
    recievedQuant: req.query.Recieve_Qty,
    remainingQuant: req.query.Remain_Qty,
    cycleTime: req.query.Cycle_Time,
    runHours: req.query.Run_Hours,
    runDays: req.query.Run_Days,
    amountTotal: req.query.Amount_Total,
    amountPerHour: req.query.PerHour,
    amountPerUnit: req.query.PerUnit,
  }, (err, job) => {
    if (err || job.length <= 0) return res.json({
      success: false,
      error: err
    });
    console.log('hit');
    var token = jwt.sign(
      { Job_Num: job.Job_Num },
      'thisIsAInventoryManagementSystem123',
      { expiresIn: 120}
    );

    res.send(token);
  });
});

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Job.find({
    orderDate: req.query.OrderDate,
    dueDate: req.query.Due_Date,
    poNum: req.query.PO_Num,
    jobNum: req.query.Job_Num,
    partNum: req.query.Part_Num,
    orderQuant: req.query.Order_Qty,
    recievedQuant: req.query.Recieve_Qty,
    remainingQuant: req.query.Remain_Qty,
    cycleTime: req.query.Cycle_Time,
    runHours: req.query.Run_Hours,
    runDays: req.query.Run_Days,
    amountTotal: req.query.Amount_Total,
    amountPerHour: req.query.PerHour,
    amountPerUnit: req.query.PerUnit,
  }, (err, job) => {
    if (err || job.length <= 0) return res.json({
      success: false,
      job: job.length,
      error: err
    });
    return res.json({
      success: true,
      job: job.length,
      job: job
    });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { orderDate, dueDate, poNum,jobNum,partNum,
  orderQuant,recievedQuant,remainingQuant,cycleTime,runHours,
  runDays, amountTotal, amountPerHour, amountPerUnit } = req.query;
  if (jobNum === undefined) return res.json({
    success: false,
    jobNum: undefined
  });
  Job.findOne({ Job_Num: jobnum }, (err, job) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    if (req.query.orderDate != undefined) job.orderDate = orderDate;
    if (req.query.Due_Date != undefined) job.Due_Date = dueDate;
    if (req.query.PO_Num != undefined) job.PO_Num = poNum;
    if (req.query.Job_Num != undefined) job.Job_Num = jobNum;
    if (req.query.Part_Num != undefined) job.Part_Num = partNum;
    if (req.query.Order_Qty != undefined) job.Order_Qty = orderQuant;
    if (req.query.Recieve_Qty != undefined) job.Recieve_Qty = recievedQuant;
    if (req.query.Remain_Qty != undefined) job.Remain_Qty = remainingQuant;
    if (req.query.Cycle_Time != undefined) job.Cycle_Time = cycleTime;
    if (req.query.Run_Hours != undefined) job.Run_Hours = runHours;
    if (req.query.Run_Days != undefined) job.Run_Days = runDays;
    if (req.query.Amount_Total != undefined) job.Amount_Total = amountTotal;
    if (req.query.PerHour != undefined) job.PerHour = amountPerHour;
    if (req.query.PerUnit != undefined) job.PerUnit = amountPerUnit;
    job.save();
    return res.json({
      success: true,
      updatedJob: job
    });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const jobNum = req.query.Job_Num;
  Job.findOne({ 'jobNum': jobNum }, (err, job) => {
    if (err) return handleError(err);
    //if (job.permission === "admin") {
      Job.findOneAndDelete(jobNum, (err) => {
        if (err) return res.json({
          success: false,
          error: err
        });
        return res.json({
          success: true,
          removedJob: jobNum
        });
      });
    //}
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let job = new Job();
  const { orderDate, dueDate, poNum,jobNum,partNum,
  orderQuant,recievedQuant,remainingQuant,cycleTime,runHours,
  runDays, amountTotal, amountPerHour, amountPerUnit } = req.query;
  job.orderDate = orderDate;
  job.Due_Date = dueDate;
  job.PO_Num = poNum;
  job.Job_Num = jobNum;
  job.Part_Num = partNum;
  job.Order_Qty = orderQuant;
  job.Recieve_Qty = recievedQuant;
  job.Remain_Qty = remainingQuant;
  job.Cycle_Time = cycleTime;
  job.Run_Hours = runHours;
  job.Run_Days = runDays;
  job.Amount_Total = amountTotal;
  job.PerHour = amountPerHour;
  job.PerUnit = amountPerUnit;
  job.save((err) => {
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
