//import React from 'react';
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');

const url = 'mongodb://localhost:27017/';
// Database Name
const dbName = 'EmployeeDB';
// Create a new MongoClient
const client = MongoClient(url, { useUnifiedTopology: true });
//const client = new MongoClient(url, { useNewUrlParser: true });

// Use connect method to connect to the Server
  client.connect(async function(err, db) { //connect to the server
      var ran1 = randomInt(1, 100); //just a random number generated to fill out fields
      var ran2 = randomInt(1,100);//just a random number generated to fill out fields
      var dateFormat = "MM/DD/YY H"; //the format for dates, month/day/year hour

      var dbo = db.db("mydb");    //database name

      var mycol = "Material Inventory";    //collection name
      var customercol = "Customers";
      var partcol = "Part Setup";
      var jobcol = "Jobs";
      var inspectcol = "Inspect";
      var shiftcol = "Shift";
      //these are all the collections
      var jarray = [];//an array of job_nums

      //var mymat = materialFormat(db,mycol);
      var matobj = {  //a material object to try filling out fields in the material database
        name: "Material "+ran1,
        type: "Metal",
        isMatieral: true,
        isTool: false,
        quantity: ran2,
        length: .375,
        width: 17.0,
        height: 10.0,
      }; //obj editing\

      var jpartnum = await findJob(dbo, 64, jarray);
      //testing out the findjob function with
      //the jobnum 64, searches for jobnum 64 to get the corresponding partnum
      console.log("jpartnum "+jpartnum); //display jpartnum to see if it works
       var customerobj = {//a customer object to try filling out fields in the customer database
         Buyer: "Jenkins",
         Company: "Incorporated",
         Email: "dude@gmail.com",
         Phone: 763-333-3333
       };
      var inspectobj = { //an inspect object to try filling out fields in the inspect database
        date: moment(new Date('01-01-2020')).format(dateFormat),  //moment helps us use calculations with dates
        Due_Date: moment(new Date('01-05-2020')).format(dateFormat),
        Description: "good inspection",
        Job_Number: 30,
        Quantity_to_Ship: ran2 ,
        Materials: "good" ,
        Part_Num: jpartnum
      };
      var shiftobj = { //a shift object to try filling out fields in the shift database
        Job_Num: 34,    //select a specific job_num that's available
        Part_Num: await findJob(dbo, 34, jarray),
        button_to_button_time: '02:30',
        Machine_Time: '01:15' ,
        Parts_Sampled: ran1,
        Date: moment(new Date('01-01-2020')).format('H/MM/DD/YYYY'),
        Notes: "Some notes"
      };
      var jobobj = { //a job object to try filling out fields in the job database
        OrderDate: moment(new Date('01-01-2020')).format(dateFormat),
        PO_Num: ran1,
        Job_Num: ran1,
        Part_Num: ran2,
        Order_Qty: 30,
        Recieve_Qty: 0,
        Remain_Qty: 30,
        Cycle_Time: '02:40',
        Run_Hours: 30,
        Run_Days: 1,
        Due_Date: moment(new Date('05-10-2020')).format(dateFormat) ,
        MMENotes: "Notes",
        AmountTotal: {value: parseFloat("11.99"), currency: "USD"},
        PerHour: {value: parseFloat("1.99"), currency: "USD"},
        PerUnit: {value: parseFloat("5.99"), currency: "USD"},

      };
      var partobj = {
        //get partnum from Jobs
        Job_Num: 17,
        Part_Num: await findJob(dbo, 52, jarray),
        button_to_button_time: "01:20",
        Description: "good part",
        Machine_Time: "02:20",
        ToolNotes: "Good Tool",
        ViceNotes: "vice",
        Scraps: {isScraps: true, scrapQuanity: 10, Types: "silver, gold, copper"}
        //on Front-End, try to submit it so it comes in with this format
      };

      var newobj = {$set: {Due_Date: moment(new Date('05-17-2020')).format(dateFormat) }};
      //used to try out the update object function with this format and fields,

      var query = { name: "Company Inc" };  //find query
      var mysort = { Due_Date: 1 };         //sort type

      await jarrayFunction(dbo, jobcol, jarray);  //test out jarray function

      calculateTime(dbo,20);  //test out calculateTime function

      //deleteFunction(dbo,mycol, myobj);
      //insertFunction(dbo,customercol, customerobj,jarray);
      //insertFunction(dbo,mycol, matobj,jarray);
      //insertFunction(dbo,partcol,partobj,jarray);
      //insertFunction(dbo,jobcol,jobobj,jarray);

      //insertFunction(dbo,inspectcol,inspectobj,jarray );
      //insertFunction(dbo,shiftcol,shiftobj,jarray);
      //insertFunction(dbo,mycol, mymat,jarray);
      //updateFunction(dbo,jobcol, jobobj, newobj);
      //findAllFunction(dbo,mycol, myobj);
      //findQueryFunction(dbo,mycol, query);

      //these are all just functons to insert various things in the corresponding collections

      sortDueDate(dbo);

      dbo.collection("Jobs").find().sort({Due_Date: 1 });
      client.close();
    });


const jarrayFunction = async function(db, col, jarray){
  //a function used to push all jobnums found in the jobs collection into an array
  var findjobs = db.collection(col).find({Job_Num: {$exists:true}});
  await findjobs.forEach(function(document){
      jarray.push(document.Job_Num);

  });
  console.log("jarray function complete");
}

const findJob = async function(db, jobnum, jarray){
  // a function used to search all of the jobs in the jobs collections
  //for the specified jobnum
  a = null;
  var start = db.collection('Jobs').find({Job_Num: jobnum});
  await start.forEach(function(document){

    a = document.Part_Num;  //returns the part num associated with the job number
    //should be able to change partnum to another variable to get other variables
    //associated with a job num

  });
  console.log("findJobNum Function complete");
  //console.log("returning " +a);
  return a;

}

const calculateTime = async function(db, jobnum){
  // a function used to find a job associated with a jobNum
  // look at today's date and the job's runDays and runHours
  //to see if there is enough time to complete the job
  var dbo = db;
  var start = db.collection("Jobs").find({Job_Num: jobnum});
  await start.forEach(function(document){
        var dateFormat = "MM/DD/YY H";

        //console.log("hrs "+hrs);
        var today = moment().format(dateFormat);
        console.log("today "+today);
        var total = moment().add(document.Run_Days, 'days').add(document.Run_Hours, 'hours').format(dateFormat);
        var due = document.Due_Date;
        console.log("due "+due);
        console.log("today+time "+total);
        if (moment(new Date(total)).isAfter(due)){
          console.log("You don't have enought time to complete Job "+jobnum);
        }else{
          console.log("You can complete Job "+jobnum+ " in time");
        }
  });

}

const insertFunction = function(db, col, myobj, jarray){
  // insert myojb into the specified collection and if
  //if the collection is jobs, push the jobnum into the jobnum array
  var dbo = db;
  dbo.collection(col).insertOne(myobj, function(err, res){
    //if(err) throw err;
    console.log(myobj);
    console.log("Function complete. document inserted");
    console.log(col);
  });
  if (col == "Jobs"){
    console.log("job_num "+myobj.Job_Num);
    jarray.push(myobj.Job_Num);
  }

}


const deleteFunction = function(db, col,  myobj){
  //delete myobj from specified collection
  var dbo = db;
  dbo.collection(col).deleteOne(myobj, function(err, obj){
    if (err) throw err;
    console.log("1 Document Deleted from Customers.");
  });
}


const updateFunction = function(db, col, myobj, newobj){
  //update myobj with newobj in the specificied collection
  var dbo = db;
  dbo.collection(col).updateOne(myobj, newobj, function(err, res){
    if (err) throw err;
    console.log(myobj+ " updated in customers.");
  });
}


const findAllFunction = function(db,col, myobj){
  //display everything in command prompt in specified collection
  var dbo = db;
  dbo.collection(col).find({}).toArray(function(err, result){
    if (err) throw err;
    console.log(result);
  });
}


const findQueryFunction = function(db,col, query){
  //Find a specific query or specific item within the specified collection
  var dbo = db;
  dbo.collection(col).find(query).toArray(function(err, result){
    if (err) throw err;
    console.log(result);
  });
}


const sortDatabase = function(db,col, sortType){
  //sort specified collection by the specified sort type and display in command prompt
  var dbo = db;
  dbo.collection(col).find().sort(sortType).toArray(function(err, result){
    if (err) throw err;
    console.log(result);
  })
}

const sortDueDate = function(db){
  //sort the jobs collection by due date in order and display in command prompt
  var dbo = db;
  dbo.collection("Jobs").find().sort({Due_Date: 1}, function(err, cursor){
    if (err) throw err;
    console.log("sort by due date");
    console.log(cursor);
  })
}

const deleteCollection = function(db, col){
  //delete the entire specified collection
  var dbo = db;
  dbo.collection(col).drop(function(err, delOK){
    if (err) throw err;
    if (delOK) console.log("Collection " +col+ " Deleted.");
  })
}

const randomInt = function(low, high) {
  // return a random int
  return Math.floor(Math.random() * (high - low + 1) + low)
}
