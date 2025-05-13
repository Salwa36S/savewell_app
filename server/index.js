// server/index.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import UserModel from "./Models/UserModel.js";
import FeedbackModel from "./Models/FeedbackModel.js";
import SavingModel from "./Models/SavingModel.js";
import LikedSavingModel from "./Models/LikedSavingModel.js";

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://yasalwa53:save123@cluster0.onbuymi.mongodb.net/SaveWellDB?retryWrites=true&w=majority");

// File upload setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: storage });

// ==================== ROUTES ==================== //

// 🧩 User Registration
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ user: newUser, message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration." });
  }
});

// 🧩 User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    res.status(200).json({ user, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🧩 Update User Profile
app.put("/updateUserProfile/:email", upload.single("profilePic"), async (req, res) => {
  try {
    const email = req.params.email;
    const { name, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.file) {
      const profilePic = req.file.filename;
      if (user.profilePic) {
        const oldPath = path.join(__dirname, "uploads", user.profilePic);
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Failed to delete old profile picture:", err);
        });
      }
      user.profilePic = profilePic;
    }

    user.name = name;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ user, message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🧩 Submit Saving
app.post("/submitSaving", async (req, res) => {
  try {
    const { userName, userEmail, salary, electricity, water, household, personal, totalExpenses, remaining } = req.body;

    const newSaving = new SavingModel({
      userName,
      userEmail,
      salary,
      electricity,
      water,
      household,
      personal,
      totalExpenses,
      remaining,
    });

    await newSaving.save();
    res.status(201).json({ message: "Saving submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit saving." });
  }
});

// 🧩 Submit Feedback
app.post("/submitFeedback", async (req, res) => {
  try {
    const { userName, userEmail, rating, feedbackText } = req.body;

    const newFeedback = new FeedbackModel({
      userName,
      userEmail,
      rating,
      feedbackText,
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error submitting feedback.", error: error.message });
  }
});

// 🧩 Get All Savings
app.get("/getAllSavings", async (req, res) => {
  try {
    const savings = await SavingModel.find();
    res.status(200).json(savings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all savings." });
  }
});

// 🧩 Get User Savings by Email
app.get("/getUserSavings/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const savings = await SavingModel.find({ userEmail });
    res.status(200).json(savings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user savings." });
  }
});

// ==================== LIKED SAVINGS ==================== //

// 🧩 Like a Saving
app.post("/likeSaving", async (req, res) => {
  try {
    const { userEmail, savingId } = req.body;

    const existingLike = await LikedSavingModel.findOne({ userEmail, savingId });
    if (existingLike) {
      return res.status(400).json({ message: "Saving already liked." });
    }

    const newLike = new LikedSavingModel({ userEmail, savingId });
    await newLike.save();

    res.status(201).json({ message: "Saving liked successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error liking saving." });
  }
});

// 🧩 Unlike a Saving
app.delete("/unlikeSaving", async (req, res) => {
  try {
    const { userEmail, savingId } = req.body;

    const deletedLike = await LikedSavingModel.findOneAndDelete({ userEmail, savingId });
    if (!deletedLike) {
      return res.status(404).json({ message: "Saving not found in likes." });
    }

    res.status(200).json({ message: "Saving unliked successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error unliking saving." });
  }
});

// 🧩 Get Liked Savings for a User
app.get("/getLikedSavings/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;

    const likedSavings = await LikedSavingModel.find({ userEmail }).populate("savingId");
    res.status(200).json(likedSavings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching liked savings." });
  }
});

// ==================== SERVER ==================== //

app.listen(3001, () => {
  console.log("✅ Server is running on port 3001");
});
