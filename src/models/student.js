const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    authUser: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthUser', required: true },
    rollNo: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    email: { type: String, required: true },
    mobile: { type: String },
    fatherName: { type: String },
    motherName: { type: String },
    address: { type: String },
    picture: { type: String }, // Store image URL or path
    courses: [{ type: String }], // Optional sub-document or array of course IDs
    department: { type: String },
});

module.exports = mongoose.model('Student', studentSchema,"students");