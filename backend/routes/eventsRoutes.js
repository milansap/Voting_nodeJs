const express = require("express");
const Events = require("../models/events");
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

router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const events = await Events.find();
    const records = events.map((event) => ({
      id: event._id,
      title: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
    }));
    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching events", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user || !(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const data = req.body;
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
