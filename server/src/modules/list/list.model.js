const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'List title is required'],
    trim: true,
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  color: {
    type: String,
    default: '#868e96',
  },
  position: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);