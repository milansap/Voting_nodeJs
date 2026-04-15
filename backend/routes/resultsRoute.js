const express = require("express");
const Results = require("../models/results");
const router = express.Router();

router.get("/results/:eventId", jwtAuthMiddleware, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const results = await Results.findOne({ event: eventId }).populate(
      "candidates.candidate",
    );
    if (!results) {
      return res
        .status(404)
        .json({ message: "Results not found for this event" });
    }
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching results", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
