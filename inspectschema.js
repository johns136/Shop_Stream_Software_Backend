const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inspectSchema = new Schema(
  {
    Job_Num: {
      type: Int,
      unique: true,
      required: true
    },
    Part_Num: {
      type: Int
    },
    Date: {
      type: Date
    },
    Due_Date: {
      type: Date
    },
    Description: {
      type: String
    },
    Quantity_to_Ship: {
      type: Int
    },
    MaterialQuality: {
      type: String
    },
  },
  {collection: 'inspect'}
  }
);
module.exports = mongoose.model("Inspect", inspectSchema);
