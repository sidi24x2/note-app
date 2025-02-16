const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let NoteSchema = new Schema(
  {
    slug: String,
    title: { type: String, unique: true },
    content: String,
    author: { type: String, required: true },
    favorited: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', NoteSchema);
