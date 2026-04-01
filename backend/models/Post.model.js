const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  comment: {
    type: String,
    required: [true, "Comment text is required"],
    trim: true,
    maxlength: [500, "Comment cannot exceed 500 characters"],
  },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  text: { type: String, trim: true, maxlength: [1000, "Post text cannot exceed 1000 characters"], default: "" },
  image: { type: String, default: "" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
}, { timestamps: true });

// Validation: text or image must be present
postSchema.pre("save", function (next) {
  if (!this.text && !this.image) return next(new Error("Post must have text or an image"));
  next();
});

module.exports = mongoose.model("Post", postSchema);