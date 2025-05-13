import mongoose from "mongoose";

const SavingSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    salary: { type: Number, required: true },
    electricity: { type: Number, required: true },
    water: { type: Number, required: true },
    household: { type: Number, required: true },
    personal: { type: Number, required: true },
    totalExpenses: { type: Number, required: true },
    remaining: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("savings", SavingSchema);
