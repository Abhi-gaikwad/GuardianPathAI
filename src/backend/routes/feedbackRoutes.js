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

// ✅ POST Feedback
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

    // Ensure required fields are present
    if (!source || !destination) {
      return res.status(400).json({ error: "Source and destination are required" });
    }

    const feedback = new Feedback({
      source,
      destination,
      roadCondition,
      trafficDensity,
      roadQuality,
      safestTime,
      accidentOccurred: accidentOccurred || false,
      accidentCount: accidentOccurred ? (accidentCount || 1) : 0,
      crimeRate,
      review
    });

    await feedback.save();
    res.status(201).json({ message: "✅ Feedback stored successfully!", data: feedback });
  } catch (error) {
    console.error("❌ Error saving feedback:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ GET All Feedback
router.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("❌ Error fetching feedbacks:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;