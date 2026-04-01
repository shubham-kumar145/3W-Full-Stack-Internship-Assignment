import React, { useState } from "react";
import {
  Card, CardContent, CardActions, CardMedia, Avatar, Box,
  Typography, IconButton, Button, Collapse, Tooltip, Chip,
} from "@mui/material";
import {
  FavoriteBorder, Favorite, ChatBubbleOutline,
  ChatBubble, MoreHoriz,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { toggleLikeService } from "../services/post.service";
import CommentSection from "./CommentSection";

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 60%, 45%)`;
};

const PostCard = ({ post }) => {
  const { user, isAuthenticated } = useAuth();

  // Optimistic UI state
  const [likes, setLikes] = useState(post.likes || []);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isLiked = user ? likes.some((id) => id.toString() === user._id.toString()) : false;

  const handleLike = async () => {
    if (!isAuthenticated || likeLoading) return;

    // Optimistic update
    const wasLiked = isLiked;
    setLikes((prev) =>
      wasLiked ? prev.filter((id) => id.toString() !== user._id.toString()) : [...prev, user._id]
    );
    setLikeLoading(true);

    try {
      const data = await toggleLikeService(post._id);
      setLikes(data.likes);
    } catch {
      // Revert on error
      setLikes((prev) =>
        wasLiked ? [...prev, user._id] : prev.filter((id) => id.toString() !== user._id.toString())
      );
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        mb: 2,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1.2}>
            <Avatar sx={{ bgcolor: stringToColor(post.username), fontWeight: 700, width: 40, height: 40 }}>
              {post.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
                @{post.username}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Options">
            <IconButton size="small" sx={{ color: "text.disabled" }}>
              <MoreHoriz fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Text */}
        {post.text && (
          <Typography variant="body1" sx={{ mb: post.image ? 1.5 : 0, lineHeight: 1.6, wordBreak: "break-word" }}>
            {post.text}
          </Typography>
        )}
      </CardContent>

      {/* Image */}
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{ maxHeight: 400, objectFit: "cover", cursor: "pointer" }}
        />
      )}

      <CardActions sx={{ px: 2, py: 1, borderTop: "1px solid #f5f5f5" }}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Tooltip title={isAuthenticated ? (isLiked ? "Unlike" : "Like") : "Login to like"}>
            <IconButton
              size="small"
              onClick={handleLike}
              disabled={!isAuthenticated || likeLoading}
              sx={{ color: isLiked ? "error.main" : "text.secondary", transition: "transform 0.1s", "&:active": { transform: "scale(0.85)" } }}
            >
              {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color="text.secondary" fontWeight={600} minWidth={20}>
            {likes.length}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={0.5} ml={1}>
          <IconButton
            size="small"
            onClick={() => setShowComments((v) => !v)}
            sx={{ color: showComments ? "primary.main" : "text.secondary" }}
          >
            {showComments ? <ChatBubble fontSize="small" /> : <ChatBubbleOutline fontSize="small" />}
          </IconButton>
          <Typography variant="body2" color="text.secondary" fontWeight={600} minWidth={20}>
            {commentCount}
          </Typography>
        </Box>

        <Box flex={1} />

        {!isAuthenticated && (
          <Chip label="Login to interact" size="small" variant="outlined" sx={{ fontSize: 11 }} />
        )}
      </CardActions>

      {/* Comments */}
      <Collapse in={showComments} timeout="auto">
        <Box px={2} pb={2}>
          <CommentSection
            postId={post._id}
            comments={post.comments || []}
            onCommentAdded={(count) => setCommentCount(count)}
          />
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard;