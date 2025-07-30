// src/models/authUser.js
const mongoose = require("mongoose");

const authUserSchema = new mongoose.Schema({
  auth_id: { type: String, required: true, unique: true },
  login_email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date_created: { type: Date, default: Date.now },
  is_verified: { type: Boolean, default: false },
  jwt_token: { type: String, default: "" },
  role:{type :String,default:"student"},
});
 
module.exports = mongoose.model("AuthUser", authUserSchema,"authuser");