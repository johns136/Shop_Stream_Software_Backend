const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shiftSchema = new Schema(
  {
    Job_Num: {
      type: Int,
      unique: true,
      required: true
    },
    Part_Num: {
      type: Int
    },
    button_to_button_time: {
      type: Date
    },
    machine_time: {
      type: Date
    },
    Parts_Sampled: {
      type: Int
    },
    Date: {
      type: Date
    },
    ShiftNotes: {
      type: String
    },
  },
  {collection: 'shifts'}
  }
);
module.exports = mongoose.model("Shifts", shiftSchema);
