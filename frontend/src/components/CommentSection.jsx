import React, { useState } from "react";
import {
  Box, TextField, Button, Avatar, Typography,
  Divider, CircularProgress,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { addCommentService } from "../services/post.service";
import { useAuth } from "../context/AuthContext";

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 60%, 45%)`;
};

const CommentSection = ({ postId, comments: initialComments, onCommentAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      const data = await addCommentService(postId, text.trim());
      const updated = [...comments, data.comment];
      setComments(updated);
      setText("");
      if (onCommentAdded) onCommentAdded(data.commentCount);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {comments.length > 0 && <Divider sx={{ mb: 1.5 }} />}

      {/* Comment list */}
      <Box display="flex" flexDirection="column" gap={1.5} mb={2}>
        {comments.map((c) => (
          <Box key={c._id} display="flex" gap={1} alignItems="flex-start">
            <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: stringToColor(c.username), fontWeight: 700 }}>
              {c.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box flex={1} bgcolor="#f5f5f5" borderRadius={2} px={1.5} py={0.8}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" fontWeight={700} color="text.primary">
                  @{c.username}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={0.3} sx={{ wordBreak: "break-word" }}>
                {c.comment}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Add comment input */}
      {isAuthenticated && (
        <Box display="flex" gap={1} alignItems="flex-end">
          <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: stringToColor(user?.username || "U"), fontWeight: 700 }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            multiline
            maxRows={3}
            inputProps={{ maxLength: 500 }}
            error={!!error}
            helperText={error}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13 } }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, minWidth: 64, height: 36 }}
          >
            {loading ? <CircularProgress size={16} color="inherit" /> : "Send"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;