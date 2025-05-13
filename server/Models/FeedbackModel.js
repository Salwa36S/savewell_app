import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, required: true },
  feedbackText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("feedbacks", FeedbackSchema);
