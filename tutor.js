const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
//const url = 'mongodb://localhost/EmployeeDB';
const url = 'mongodb://localhost:27017/';
// Database Name
const dbName = 'EmployeeDB';
// Create a new MongoClient
const client = MongoClient(url, { useUnifiedTopology: true });
//const client = new MongoClient(url, { useNewUrlParser: true });

// Use connect method to connect to the Server
client.connect(function(err, db) {

  var ran1 = randomInt(1, 100);
  var ran2 = randomInt(1,100);
  var curdate = new Date();

  var dbo = db.db("mydb");    //database name

  var mycol = "Material Inventory";    //collection name
  var customercol = "Customers";
  var partcol = "Part Setup";
  var jobcol = "Jobs";
  var inspectcol = "Inspect";
  var shiftcol = "Shift";
  var jarray = [];//an array of job_nums

  //var mymat = materialFormat(db,mycol);
  var matobj = {
    name: "Material "+ran1,
    type: "Metal",
    isMatieral: true,
    isTool: false,
    quantity: ran2,
    jobs_for: "Job 1"
  }; //obj editing\

   var customerobj = {
     Buyer: "Jenkins",
     Company: "Incorporated",
   };
  var inspectobj = {
    date: new Date('2020-01-01'),
    Due_Date: new Date('2020-01-05'),
    Description: "good inspection",
    Job_Number: "get job",
    Quantity_to_Ship: ran2 ,
    Materials: "good"
    //getfromJob - partnum, jobnum, duedate
    //getfromCustomer - company,buyer
  };
  var shiftobj = {
    //getfromJob - partnum, jobnum,
    button_to_button_time: '02:30',
    Machine_Time: '01:15' ,
    Parts_Sampled: ran1,
    Date: new Date('2020-01-01'),
    Notes: "Some notes"
  };
  //var order = { Order_Qty: };
  //console.log(order);
  var jobobj = {
    OrderDate: new Date('2020-01-01'),
    PO_Num: ran1,
    Job_Num: ran1,
    Part_Num: ran2,
    Order_Qty: 30,
    Recieve_Qty: 0,
    //Remain_Qty: findQueryFunction(dbo,jobcol,Order_Qty) - findQueryFunction(dbo,jobcol,Recieve_Qty) ,
    Cycle_Time: '02:40',
    Run_Hours: 30,
    Run_Days: 1,
    Due_Date: new Date('2020-01-05') ,
    MMENotes: "Notes",
    Amount2: "$"+11.99,
    Amount: {value: parseFloat("11.99"), currency: "USD"},
    PerHour: {value: parseFloat("1.99"), currency: "USD"},
    PerUnit: {value: parseFloat("5.99"), currency: "USD"},
    Total: {value: parseFloat("11.99"), currency: "USD"}

  };
  var partobj = {
    //get partnum from Jobs
    button_to_button_time: "01:20",
    Description: "good part",
    Machine_Time: "02:20",
    ToolNotes: "Good Tool",
    ViceNotes: "vice"
  };

  var newobj = {$set: {status: "broken", quantity: 11 }}; //update object
  var query = { name: "Company Inc" };  //find query
  var mysort = { quantity: -1 };         //sort type
  //deleteFunction(dbo,mycol, myobj);
  //insertFunction(dbo,customercol, customerobj,jarray);
  //insertFunction(dbo,mycol, matobj,jarray);
  //insertFunction(dbo,partcol,partobj,jarray);
  insertFunction(dbo,jobcol,jobobj,jarray);

  //insertFunction(dbo,inspectcol,inspectobj,jarray );
  //insertFunction(dbo,shiftcol,shiftobj,jarray);
  //insertFunction(dbo,mycol, mymat,jarray);
  //updateFunction(dbo,mycol, myobj, newobj);
  //findAllFunction(dbo,mycol, myobj);
  //findQueryFunction(dbo,mycol, query);
  //sortDatabase(dbo,mycol, mysort);
  //deleteCollection(dbo, mycol);
  console.log(jarray);
  client.close();
});

//insert myobj into collection customers
const insertFunction = function(db, col, myobj, jarray){
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

//delete myobj from collection customers
const deleteFunction = function(db, col,  myobj){
  var dbo = db;
  dbo.collection(col).deleteOne(myobj, function(err, obj){
    if (err) throw err;
    console.log("1 Document Deleted from Customers.");
  });
}

//update myobj with newobj in collection customers
const updateFunction = function(db, col, myobj, newobj){
  var dbo = db;
  dbo.collection(col).updateOne(myobj, newobj, function(err, res){
    if (err) throw err;
    console.log(myobj.name+ " updated in customers.");
  });
}

//display everything in collection customers
const findAllFunction = function(db,col, myobj){
  var dbo = db;
  dbo.collection(col).find({}).toArray(function(err, result){
    if (err) throw err;
    console.log(result);
  });
}

//Find a specific query or specific item
const findQueryFunction = function(db,col, query){
  var dbo = db;
  dbo.collection(col).find(query).toArray(function(err, result){
    if (err) throw err;
    console.log(result);
  });
}

//sort collection customers by the specified sort type
const sortDatabase = function(db,col, sortType){
  var dbo = db;
  dbo.collection(col).find().sort(sortType).toArray(function(err, result){
    if (err) throw err;
    console.log(result);
  })
}

const deleteCollection = function(db, col){
  var dbo = db;
  dbo.collection(col).drop(function(err, delOK){
    if (err) throw err;
    if (delOK) console.log("Collection " +col+ " Deleted.");
  })
}

const materialFormat = function(db, col) {
  var dbo = db;
  var myobj = [
    { name: '',
    quantity: 0,
    status: ''
    }
  ];
  return myobj;
}


const randomInt = function(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}
