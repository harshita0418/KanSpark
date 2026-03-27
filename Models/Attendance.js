const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent"], default: "present" },
  checkIn: { type: String },
  checkOut: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
