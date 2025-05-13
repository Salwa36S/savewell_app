// server/Models/SavingModel.js

import mongoose from "mongoose";

const SavingSchema = new mongoose.Schema({
  userName: { 
    type: String, 
    required: true, 
    trim: true // 🧹 automatically remove spaces
  },
  userEmail: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true // 🧹 saves all emails lowercase
  },
  salary: { 
    type: Number, 
    required: true 
  },
  electricity: { 
    type: Number, 
    required: true 
  },
  water: { 
    type: Number, 
    required: true 
  },
  household: { 
    type: Number, 
    required: true 
  },
  personal: { 
    type: Number, 
    required: true 
  },
  totalExpenses: { 
    type: Number, 
    required: true 
  },
  remaining: { 
    type: Number, 
    required: true 
  },
}, { timestamps: true }); 

const SavingModel = mongoose.model("Saving", SavingSchema);

export default SavingModel;
