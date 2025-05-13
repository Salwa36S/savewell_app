// server/Models/UserModel.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
}, { timestamps: true });

const UserModel = mongoose.model("userInfos", UserSchema);
export default UserModel;
