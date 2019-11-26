const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matSchema = new Schema(
  {
    Job_Num: {
      type: Int,
      unique: true,
      required: true
    },
    Name: {
      type: String
    },
    matType: {
      type: String
    },
    isTool: {
      type: Boolean
    },
    isMatieral: {
      type: Boolean
    },
    Quantity: {
      type: Int
    },
    Length: {
      type: Int
    },
    Width: {
      type: Int
    },
    Height: {
      type: Int
    },
  },
  {collection: 'Materials'}
  }
);
module.exports = mongoose.model("Materials", matSchema);
