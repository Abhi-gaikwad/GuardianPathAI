// const express = require("express");
// const router = express.Router();
// const Feedback = require("../models/Feedback");

// // ✅ POST Feedback
// router.post("/api/feedbacks", async (req, res) => {
//   try {
//     const {
//       source,
//       destination,
//       roadCondition,
//       trafficDensity,
//       roadQuality,
//       safestTime,
//       accidentOccurred,
//       accidentCount,
//       crimeRate,
//       review
//     } = req.body;

//     const feedback = new Feedback({
//       source,
//       destination,
//       roadCondition,
//       trafficDensity,
//       roadQuality,
//       safestTime,
//       accidentOccurred: accidentOccurred || false,
//       accidentCount: accidentOccurred ? (accidentCount || 1) : 0,
//       crimeRate,
//       review
//     });

//     await feedback.save();
//     res.status(201).json({ message: "Feedback stored successfully!", data: feedback });
//   } catch (error) {
//     console.error("Error saving feedback:", error);
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// });

// // GET All Feedback
// router.get("/api/feedbacks", async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//     res.json(feedbacks);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST Feedback
router.post("/feedbacks", async (req, res) => {
  try {
    const {
      source,
      destination,
      roadCondition,
      trafficDensity,
      roadQuality,
      safestTime,
      accidentOccurred,
      accidentCount,
      crimeRate,
      review
    } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ error: "Source and destination are required" });
    }

    const feedback = new Feedback({
      source: source.trim().toLowerCase(), // Store in lowercase
      destination: destination.trim().toLowerCase(), // Store in lowercase
      roadCondition,
      trafficDensity,
      roadQuality,
      safestTime,
      accidentOccurred: accidentOccurred || false,
      accidentCount: accidentOccurred ? (accidentCount || 1) : 0,
      crimeRate,
      review
    });

    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
    
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// GET Feedback for specific route - More precise matching
router.get("/feedbacks", async (req, res) => {
  try {
    const { source, destination } = req.query;
    
    if (!source || !destination) {
      return res.status(400).json({ error: "Both source and destination are required" });
    }

    console.log(`Fetching feedback for: ${source} -> ${destination}`);

    // Convert to lowercase for consistent matching
    const sourceQuery = source.trim().toLowerCase();
    const destinationQuery = destination.trim().toLowerCase();

    // Try exact match first
    let feedbacks = await Feedback.find({
      source: sourceQuery,
      destination: destinationQuery
    }).sort({ createdAt: -1 });

    // If no exact match, try partial match with regex
    if (feedbacks.length === 0) {
      feedbacks = await Feedback.find({
        $and: [
          {
            $or: [
              { source: { $regex: new RegExp(sourceQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
              { source: { $regex: new RegExp(sourceQuery.split(' ').join('.*'), 'i') } }
            ]
          },
          {
            $or: [
              { destination: { $regex: new RegExp(destinationQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
              { destination: { $regex: new RegExp(destinationQuery.split(' ').join('.*'), 'i') } }
            ]
          }
        ]
      }).sort({ createdAt: -1 });
    }

    console.log(`Found ${feedbacks.length} feedback(s) for route`);
    res.json(feedbacks);
    
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// GET All feedback (for admin purposes)
// router.get("/feedbacks/all", async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//     res.json(feedbacks);
//   } catch (error) {
//     console.error("Error fetching all feedback:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// DELETE feedback by ID (for admin purposes)
router.delete("/feedbacks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    
    if (!deletedFeedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    
    res.json({ message: "Feedback deleted successfully", data: deletedFeedback });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;