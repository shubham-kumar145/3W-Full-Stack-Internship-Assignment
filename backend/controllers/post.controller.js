const Post = require("../models/Post.model");

// GET /api/posts
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const postsWithCounts = posts.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
    }));

    res.status(200).json({
      success: true,
      posts: postsWithCounts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNextPage: page * limit < totalPosts,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("GetPosts error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

// POST /api/posts
const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? req.file.path : "";

    if (!text && !imageUrl)
      return res.status(400).json({ success: false, message: "Post must have text or an image" });

    const post = await Post.create({
      userId: req.user._id,
      username: req.user.username,
      text: text || "",
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: { ...post.toObject(), likeCount: 0, commentCount: 0 },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    console.error("CreatePost error:", err);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
};

// PUT /api/posts/:id/like
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likeCount: post.likes.length,
      likes: post.likes,
    });
  } catch (err) {
    console.error("ToggleLike error:", err);
    res.status(500).json({ success: false, message: "Failed to update like" });
  }
};

// POST /api/posts/:id/comment
const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment?.trim())
      return res.status(400).json({ success: false, message: "Comment text is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const newComment = {
      userId: req.user._id,
      username: req.user.username,
      comment: comment.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "Comment added",
      comment: addedComment,
      commentCount: post.comments.length,
    });
  } catch (err) {
    console.error("AddComment error:", err);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

module.exports = { getPosts, createPost, toggleLike, addComment };