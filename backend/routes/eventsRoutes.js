const express = require("express");
const mongoose = require("mongoose");
const Events = require("../models/events");
const Candidate = require("../models/candidates");
const { jwtAuthMiddleware } = require("../jwt");
const User = require("../models/user");
const router = express.Router();

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role === "admin") {
      return true;
    }
  } catch (err) {
    console.error("Error checking admin role", err);
    return false;
  }
};

const mapCandidateRecord = (candidate, voteCount = 0) => ({
  id: candidate._id,
  name: candidate.name,
  party: candidate.party,
  age: candidate.age,
  image: candidate.image,
  position: candidate.position,
  voteCount: voteCount,
  votesCount: candidate.votes?.length ?? 0,
});

const mapEventRecord = (event, candidateMap) => {
  const candidates = (event.candidates || [])
    .map((item) => {
      const candidateId = String(item.candidate || item);
      const candidate = candidateMap.get(candidateId);
      return candidate ? mapCandidateRecord(candidate, item.voteCount || 0) : null;
    })
    .filter(Boolean);

  return {
    id: event._id,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    status: event.status,
    candidates,
  };
};

const validateCandidateIds = async (candidateIds) => {
  if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
    return {
      isValid: false,
      status: 400,
      message: "Candidates are required",
    };
  }

  const normalizedIds = candidateIds.map((candidateId) => String(candidateId));
  const invalidCandidateIds = normalizedIds.filter(
    (candidateId) => !mongoose.Types.ObjectId.isValid(candidateId),
  );

  if (invalidCandidateIds.length > 0) {
    return {
      isValid: false,
      status: 400,
      message: "Invalid candidate id(s)",
      invalidCandidateIds,
    };
  }

  const uniqueCandidateIds = [...new Set(normalizedIds)];
  const existingCandidates = await Candidate.find({
    _id: { $in: uniqueCandidateIds },
  })
    .select("_id")
    .lean();

  const existingCandidateIdSet = new Set(
    existingCandidates.map((candidate) => String(candidate._id)),
  );
  const missingCandidateIds = uniqueCandidateIds.filter(
    (candidateId) => !existingCandidateIdSet.has(candidateId),
  );

  if (missingCandidateIds.length > 0) {
    return {
      isValid: false,
      status: 400,
      message: "Some candidates were not found",
      missingCandidateIds,
    };
  }

  return {
    isValid: true,
    candidateIds: uniqueCandidateIds.map((candidateId) => ({
      candidate: candidateId,
      voteCount: 0,
    })),
  };
};

router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const events = await Events.find().lean();
    const allCandidateIds = [
      ...new Set(
        events.flatMap((event) =>
          (event.candidates || []).map((item) => String(item.candidate || item)),
        ),
      ),
    ];

    const candidates = await Candidate.find({
      _id: { $in: allCandidateIds },
    }).lean();

    const candidateMap = new Map(
      candidates.map((candidate) => [String(candidate._id), candidate]),
    );

    const records = events.map((event) => mapEventRecord(event, candidateMap));
    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching events", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:eventId", jwtAuthMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const event = await Events.findById(eventId).lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const candidateIds = (event.candidates || []).map((item) =>
      String(item.candidate || item),
    );
    const candidates = await Candidate.find({
      _id: { $in: candidateIds },
    }).lean();
    const candidateMap = new Map(
      candidates.map((candidate) => [String(candidate._id), candidate]),
    );

    const record = mapEventRecord(event, candidateMap);

    res.status(200).json(record);
  } catch (err) {
    console.error("Error fetching event by id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user || !(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const data = req.body;
    const candidateValidation = await validateCandidateIds(data.candidates);

    if (!candidateValidation.isValid) {
      return res.status(candidateValidation.status).json({
        message: candidateValidation.message,
      });
    }

    data.candidates = candidateValidation.candidateIds;

    const newEvent = new Events(data);
    const response = await newEvent.save();
    res.status(201).json({
      message: "Event created successfully",
      response: response,
    });
  } catch (err) {
    console.error("Error creating event", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:eventId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user || !(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const eventId = req.params.eventId;
    const updateEventData = req.body;

    if (Object.prototype.hasOwnProperty.call(updateEventData, "candidates")) {
      const candidateValidation = await validateCandidateIds(
        updateEventData.candidates,
      );

      if (!candidateValidation.isValid) {
        return res.status(candidateValidation.status).json({
          message: candidateValidation.message,
        });
      }

      updateEventData.candidates = candidateValidation.candidateIds;
    }

    const updatedEvent = await Events.findByIdAndUpdate(
      eventId,
      updateEventData,
      { new: true },
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({
      message: "Event updated successfully",
      response: updatedEvent,
    });
  } catch (err) {
    console.error("Error updating event", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

router.delete("/:eventId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user || !(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const eventId = req.params.eventId;
    const deletedEvent = await Events.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

module.exports = router;
