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
      const event = await Events.findById(eventId).populate("candidates.candidate");
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const records = event.candidates.map((item) => {
        const candidate = item.candidate;
        const eventVotes = candidate.votes.filter(
          (vote) => vote.event.toString() === eventId
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

    // Otherwise, fetch all candidates without event-specific counts
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
  const candidateId = req.params.candidateId;
  const userId = req.user.id;
  const eventId = req.body.eventId;

  try {
    const candidate = await Candidate.findById(candidateId);
    const event = await Events.findById(eventId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user's role is admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot vote" });
    }

    // Check if event voting is active
    if (event.status !== "ongoing") {
      return res
        .status(403)
        .json({ message: "Voting is not active for this event" });
    }

    // Check if user is assigned to this event
    const isAssignedToEvent = user.assignedEvents.some(
      (eventIdInArray) => eventIdInArray.toString() === eventId,
    );
    if (user.assignedEvents.length > 0 && !isAssignedToEvent) {
      return res
        .status(403)
        .json({ message: "You are not assigned to vote in this event" });
    }

    // Check if user has already voted in this event by checking all candidates in the event
    const allCandidatesInEvent = await Candidate.find({ events: eventId });
    const hasVotedForEvent = allCandidatesInEvent.some((cand) =>
      cand.votes.some(
        (vote) =>
          vote.user.toString() === userId && vote.event.toString() === eventId,
      ),
    );

    if (hasVotedForEvent) {
      return res
        .status(403)
        .json({ message: "You have already voted for this event" });
    }

    // Add vote to candidate
    candidate.votes.push({ user: userId, event: eventId });
    await candidate.save();

    // Update vote count in event's candidates array
    const candidateInEvent = event.candidates.find(
      (c) => c.candidate.toString() === candidateId
    );
    if (candidateInEvent) {
      candidateInEvent.voteCount++;
    } else {
      // If candidate not in event candidates array, add it
      event.candidates.push({ candidate: candidateId, voteCount: 1 });
    }
    await event.save();

    // Add event to user's votedEvents array
    user.votedEvents.push(eventId);
    user.isVoted = true; // Keep for backward compatibility
    await user.save();

    res.status(200).json({
      message: "Vote cast successfully",
      candidate: candidate,
    });
  } catch (err) {
    console.error("Error casting vote", err);
    return res.status(500).json({ error: "Failed to cast vote" });
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
      const event = await Events.findById(eventId).populate("candidates.candidate");
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
