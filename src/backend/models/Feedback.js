const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    destination: { type: String, required: true },
    roadCondition: { type: String, enum: ["Good", "Moderate", "Bad"], required: true },
    trafficDensity: { type: Number, required: true, min: 0, max: 100 },
    roadQuality: { type: Number, required: true, min: 1, max: 5 },
    safestTime: { type: String, enum: ["Morning", "Afternoon", "Evening", "Night"], required: true },
    accidentOccurred: { type: Boolean, required: true },
    accidentCount: { type: Number, min: 0, default: 0 },
    crimeRate: { type: Number, required: true, min: 0 },
    review: { type: String, required: true },
    sentimentScore: { type: Number, min: -1, max: 1, default: 0 },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("FeedbackDB", feedbackSchema);
module.exports = Feedback;
