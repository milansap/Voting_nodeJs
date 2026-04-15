const mongoose = require("mongoose");
// const bcrypt = require('bcryptjs');

const resultSchema = new mongoose.Schema({
  election: {
    type: String,
    required: true,
  },
  totalVotes: {
    type: Number,
    required: true,
  },
  candidates: [
    {
      name: {
        type: String,
        required: true,
      },
      votes: {
        type: Number,
        required: true,
      },
    },
  ],
  
});

const Results = mongoose.model("Results", resultSchema);
module.exports = Results;
