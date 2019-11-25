const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    Job_Num: {
      type: Int,
      unique: true,
      required: true
    },
    OrderDate: {
      type: Date
    },
    PO_Num: {
      type: Int
    },
    Part_Num: {
      type: Int
    },
    Order_Qty: {
      type: Int
    },
    Recieve_Qty: {
      type: Int
    },
    Cycle_Time: {
      type: Date
    },
    Run_Hours: {
      type: Int
    },
    Run_Days: {
      type: Int
    },
    Due_Date: {
      type: Date
    },
    MMENotes: {
      type: String
    },
    Amount: {
      type Int
    },
    PerHour: {
      type: Int
    },
    PerUnit: {
      type: Int
    },
    Total: {
      type: Int
    },
  },
  {collection: 'jobs'}

);

module.exports = mongoose.model("Jobs", jobSchema);
