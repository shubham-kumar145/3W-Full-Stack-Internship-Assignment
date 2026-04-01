const express = require("express");
const router = express.Router();
const { getPosts, createPost, toggleLike, addComment } = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");

router.get("/", getPosts);
router.post("/", protect, upload.single("image"), createPost);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);

module.exports = router;