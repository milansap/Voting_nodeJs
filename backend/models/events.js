const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
  },
  candidates: [
    {
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidates",
        required: true,
      },
      voteCount: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const Events = mongoose.model("Events", eventSchema);
module.exports = Events;
