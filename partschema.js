const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partSchema = new Schema(
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
    partDescription: {
      type: String
    },
    ToolNotes: {
      type: String
    },
    ViceNotes: {
      type: String
    },
    Scraps: {
      isScraps: Boolean,
      scrapQuanity: Int,
      Types: String
    },
  },
  { timestamps: true },
  {collection: 'parts'}
  }
);
module.exports = mongoose.model("Parts", partSchema);
