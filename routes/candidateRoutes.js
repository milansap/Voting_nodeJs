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

//POST-add a new candidate

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

module.exports = router;
