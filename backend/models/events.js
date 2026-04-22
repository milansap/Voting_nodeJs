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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidates",
      required: true,
    },
  ],
});

const Events = mongoose.model("Events", eventSchema);
module.exports = Events;
