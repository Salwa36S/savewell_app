// Models/LikedSavingModel.js
import mongoose from "mongoose";

const LikedSavingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },  
  savingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Saving" }, 
}, { timestamps: true });

export default mongoose.model("LikedSaving", LikedSavingSchema);
