const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidates");
const User = require("../models/user");
const Events = require("../models/events");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const { jwtAuthMiddleware } = require("../jwt");
const { createUpload } = require("../uploadMiddleware");

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

const uploadCandidate = createUpload("candidates");

//apis for the candidates

router.get("/", async (req, res) => {
  try {
    const { eventId } = req.query;

    if (eventId) {
      const event = await Events.findById(eventId).populate(
        "candidates.candidate",
      );
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const records = event.candidates.map((item) => {
        const candidate = item.candidate;
        const eventVotes = candidate.votes.filter(
          (vote) => vote.event.toString() === eventId,
        );
        return {
          id: candidate._id,
          name: candidate.name,
          party: candidate.party,
          age: candidate.age,
          image: candidate.image,
          position: candidate.position,
          voteCount: item.voteCount,
          votes: eventVotes.map((vote) => ({
            user: vote.user,
            votedAt: vote.votedAt,
          })),
        };
      });

      return res.status(200).json(records);
    }

    const candidates = await Candidate.find();
    const records = candidates.map((candidate) => ({
      id: candidate._id,
      name: candidate.name,
      party: candidate.party,
      image: candidate.image,
      position: candidate.position,
      votes: candidate.votes.map((vote) => ({
        user: vote.user,
        votedAt: vote.votedAt,
      })),
    }));
    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching candidates", err);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

router.post(
  "/",
  jwtAuthMiddleware,
  uploadCandidate.single("image"),
  async (req, res) => {
    try {
      if (!req.user || !(await checkAdminRole(req.user.id))) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Image file is required",
        });
      }

      const data = req.body;
      const candidates = await Candidate.find();
      const isDuplicate = candidates.some(
        (candidate) =>
          candidate.party === data.party &&
          candidate.position === data.position,
      );
      if (isDuplicate) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json({ message: "Candidate for this position already exists" });
      }

      const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
      const imagePath = `${BASE_URL}/uploads/candidates/${req.file.filename}`;
      const candidate = new Candidate(data);
      candidate.image = imagePath;
      const response = await candidate.save();

      res.status(201).json({
        response: response,
        message: "Candidate created successfully",
      });
    } catch (err) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Error creating candidate", err);
      res.status(500).json({ error: "Failed to create candidate" });
    }
  },
);

router.put(
  "/:candidateId",
  jwtAuthMiddleware,
  uploadCandidate.single("image"),
  async (req, res) => {
    try {
      if (!req.user || !(await checkAdminRole(req.user.id))) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }

      const candidateId = req.params.candidateId;
      const updatedCandidateData = req.body;

      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({
          message: "Candidate not found",
        });
      }

      // Update image if file is uploaded
      if (req.file) {
        if (candidate.image) {
          const relativePath = candidate.image.replace(
            `${process.env.BASE_URL}/`,
            "",
          );
          const oldPath = path.join(__dirname, "..", relativePath);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
        updatedCandidateData.image = `${BASE_URL}/uploads/candidates/${req.file.filename}`;
      }

      const response = await Candidate.findByIdAndUpdate(
        candidateId,
        updatedCandidateData,
        { new: true, runValidators: true },
      );

      if (!response) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      res.status(200).json({
        response: response,
        message: "Candidate updated successfully",
      });
    } catch (err) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Error updating candidate", err);
      res.status(500).json({ error: "Failed to update candidate" });
    }
  },
);

router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user || !(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const candidateId = req.params.candidateId;

    const response = await Candidate.findByIdAndDelete(candidateId);

    if (!response) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({
      response: response,
      message: "Candidate deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting candidate", err);
    res.status(500).json({ error: "Failed to delete candidate" });
  }
});

  router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  const { candidateId } = req.params;
  const userId = req.user.id;
  const { eventId } = req.body;

  // ✅ Validate required fields early
  if (!eventId) {
    return res.status(400).json({ message: "eventId is required in request body" });
  }

  if (!candidateId) {
    return res.status(400).json({ message: "candidateId is required" });
  }

  // ✅ Validate ObjectId formats
  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
  if (!isValidObjectId(candidateId) || !isValidObjectId(eventId)) {
    return res.status(400).json({ message: "Invalid candidateId or eventId format" });
  }

  try {
    // ✅ Fetch all required documents in parallel for better performance
    const [candidate, event, user] = await Promise.all([
      Candidate.findById(candidateId),
      Events.findById(eventId),
      User.findById(userId),
    ]);

    // ✅ Existence checks
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Admin cannot vote
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admins are not allowed to vote" });
    }

    // ✅ Event must be ongoing
    if (event.status !== "ongoing") {
      return res.status(403).json({ message: "Voting is not active for this event" });
    }

    // ✅ Check if candidate belongs to this event
    const candidateBelongsToEvent =
      Array.isArray(candidate.events) &&
      candidate.events.some((eid) => eid.toString() === eventId);
    if (!candidateBelongsToEvent) {
      return res.status(400).json({ message: "Candidate is not part of this event" });
    }

    // ✅ Check if user is assigned to this event (only restrict if assignedEvents is non-empty)
    if (user.assignedEvents && user.assignedEvents.length > 0) {
      const isAssignedToEvent = user.assignedEvents.some(
        (assignedEventId) => assignedEventId.toString() === eventId
      );
      if (!isAssignedToEvent) {
        return res.status(403).json({ message: "You are not assigned to vote in this event" });
      }
    }

    // ✅ FIXED: Check if user already voted in this event using votedEvents array
    const hasVotedForEvent =
      Array.isArray(user.votedEvents) &&
      user.votedEvents.some((votedEventId) => votedEventId.toString() === eventId);
    if (hasVotedForEvent) {
      return res.status(403).json({ message: "You have already voted in this event" });
    }

    // ✅ Add vote to candidate's votes array
    candidate.votes.push({ user: userId, event: eventId });
    await candidate.save();

    // ✅ Update voteCount in event's candidates array
    const candidateInEvent = event.candidates.find(
      (c) => c.candidate.toString() === candidateId
    );
    if (candidateInEvent) {
      candidateInEvent.voteCount += 1;
    } else {
      event.candidates.push({ candidate: candidateId, voteCount: 1 });
    }
    await event.save();

    // ✅ Mark user as voted
    user.votedEvents.push(eventId);
    user.isVoted = true;
    await user.save();

    // ✅ Return clean response (avoid sending full candidate doc with votes)
    return res.status(200).json({
      message: "Vote cast successfully",
      data: {
        candidateId: candidate._id,
        candidateName: candidate.name,
        eventId: event._id,
        eventName: event.name,
        totalVotes: candidateInEvent
          ? candidateInEvent.voteCount
          : 1,
      },
    });
  } catch (err) {
    console.error("Error casting vote:", err);

    // ✅ Handle Mongoose CastError separately
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format provided" });
    }

    return res.status(500).json({ message: "Internal server error. Failed to cast vote." });
  }
});

router.post("/assign-event", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user || !(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res
        .status(400)
        .json({ message: "userId and eventId are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const event = await Events.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already assigned to this event
    const isAlreadyAssigned = user.assignedEvents.some(
      (assignedEventId) => assignedEventId.toString() === eventId,
    );

    if (isAlreadyAssigned) {
      return res
        .status(400)
        .json({ message: "User is already assigned to this event" });
    }

    user.assignedEvents.push(eventId);
    await user.save();

    res.status(200).json({
      message: "Event assigned to user successfully",
      user: user,
    });
  } catch (err) {
    console.error("Error assigning event", err);
    res.status(500).json({ error: "Failed to assign event" });
  }
});

router.post("/remove-assigned-event", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user || !(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res
        .status(400)
        .json({ message: "userId and eventId are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove event from assignedEvents
    user.assignedEvents = user.assignedEvents.filter(
      (assignedEventId) => assignedEventId.toString() !== eventId,
    );
    await user.save();

    res.status(200).json({
      message: "Event assignment removed successfully",
      user: user,
    });
  } catch (err) {
    console.error("Error removing event assignment", err);
    res.status(500).json({ error: "Failed to remove event assignment" });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    const { eventId } = req.query;

    if (eventId) {
      // Get vote counts for a specific event
      const event = await Events.findById(eventId).populate(
        "candidates.candidate",
      );
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const records = event.candidates
        .sort((a, b) => b.voteCount - a.voteCount)
        .map((item) => {
          return {
            candidateId: item.candidate._id,
            party: item.candidate.party,
            count: item.voteCount,
          };
        });

      return res.status(200).json(records);
    }

    // Get overall vote counts across all events
    const events = await Events.find().populate("candidates.candidate");
    const voteCounts = {};

    events.forEach((event) => {
      event.candidates.forEach((item) => {
        const party = item.candidate.party;
        voteCounts[party] = (voteCounts[party] || 0) + item.voteCount;
      });
    });

    const records = Object.entries(voteCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([party, count]) => ({
        party,
        count,
      }));

    return res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching vote counts", err);
    res.status(500).json({ error: "Failed to fetch vote counts" });
  }
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size is too large. Maximum size allowed is 5MB",
      });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
