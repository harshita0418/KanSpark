const mongoose = require("mongoose");

const boardMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "editor", "viewer"],
    default: "viewer",
  },
}, { _id: true, timestamps: true });

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [boardMemberSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);