const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    Buyer: {
      type: String
    },
    Company: {
      type: String
    },
    Email: {
      type: String
    },
    Phone: {
      type: Int
    },
  },
  {collection: 'customers'}
  }
);
module.exports = mongoose.model("Customers", customerSchema);
