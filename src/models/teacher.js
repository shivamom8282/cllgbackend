const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    authUser: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthUser', required: true },
    name: { type: String},
    phone: { type: String },
    email: { type: String, required: true },
    gender: { type: String },
    teacherId: { type: String, required: true, unique: true },
    department: { type: String },
    qualification: { type: String },
});

module.exports = mongoose.model('Teacher', teacherSchema,"teachers");