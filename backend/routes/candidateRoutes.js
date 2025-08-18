const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidates");
const User = require("../models/user");

const { jwtAuthMiddleware } = require("../jwt");

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

//apis for the candidates

router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const records = candidates.map((candidate) => ({
      id: candidate._id,
      name: candidate.name,
      party: candidate.party,
      voteCount: candidate.voteCount,
      votes: candidate.votes.map((vote) => ({
        user: vote.user,
        votedAt: vote.votedAt,
      })),
      votesCount: candidate.votes.length,
    }));
    res.status(200).json({ records });
  } catch (err) {
    console.error("Error fetching candidates", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", jwtAuthMiddleware, async (req, res) => {
  console.log("Creating candidate:", req.body);
  try {
    if (!req.user || !(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const data = req.body;

    const newCandidate = new Candidate(data);

    const response = await newCandidate.save();

    res.status(200).json({
      response: response,
    });
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user || !(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const candidateId = req.params.candidateId;

    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      { new: true, runValidators: true }
    );

    if (!response) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res
      .status(200)
      .json({ response: response, message: "Candidate updated successfully" });
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

    res
      .status(200)
      .json({ response: response, message: "Candidate deleted successfully" });
  } catch (err) {
    console.error("Error deleting candidate", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  const candidateId = req.params.candidateId;
  const userId = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVoted) {
      return res.status(403).json({ message: "You have already voted" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot vote" });
    }

    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({
      message: "Vote cast successfully",
      candidate: candidate,
    });
  } catch (err) {
    console.error("Error fetching candidate", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: "desc" });
    const records = candidates.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching vote counts", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
