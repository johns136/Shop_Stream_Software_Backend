const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matSchema = new Schema(
  {
    Job_Num: {
      type: Int,
      unique: true,
      required: true
    },
    matName: {
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
    matQuantity: {
      type: Int
    },
    matLength: {
      type: Int
    },
    matWidth: {
      type: Int
    },
    matHeight: {
      type: Int
    },
  },
  {collection: 'Materials'}
  }
);
module.exports = mongoose.model("Materials", matSchema);
