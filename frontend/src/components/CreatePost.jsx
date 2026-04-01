import React, { useState, useRef } from "react";
import {
  Card, CardContent, TextField, Button, Box, Avatar, IconButton,
  Typography, CircularProgress, Alert, Tooltip,
} from "@mui/material";
import { Image as ImageIcon, Close as CloseIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { createPostService } from "../services/post.service";

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 60%, 45%)`;
};

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be less than 5MB"); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) { setError("Add some text or an image to post"); return; }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (text.trim()) formData.append("text", text.trim());
      if (image) formData.append("image", image);

      const data = await createPostService(formData);

      // Reset form
      setText("");
      setImage(null);
      setPreview("");
      if (fileRef.current) fileRef.current.value = "";

      // Notify parent with optimistic data
      if (onPostCreated) onPostCreated(data.post);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 3, mb: 3 }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" gap={1.5} alignItems="flex-start">
          <Avatar sx={{ bgcolor: stringToColor(user?.username || "U"), fontWeight: 700 }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box flex={1}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              placeholder={`What's on your mind, ${user?.username}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 1000 }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {/* Image preview */}
            {preview && (
              <Box position="relative" mt={1.5} display="inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 280, borderRadius: 12, display: "block", objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  onClick={removeImage}
                  sx={{ position: "absolute", top: 6, right: 6, bgcolor: "rgba(0,0,0,0.6)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.8)" } }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {error && <Alert severity="error" sx={{ mt: 1, borderRadius: 2 }}>{error}</Alert>}

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <input type="file" accept="image/*" ref={fileRef} style={{ display: "none" }} onChange={handleImageChange} />
                <Tooltip title="Add image">
                  <IconButton size="small" onClick={() => fileRef.current.click()} color="primary">
                    <ImageIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant="caption" color="text.secondary">{text.length}/1000</Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmit}
                disabled={loading || (!text.trim() && !image)}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, minWidth: 80 }}
              >
                {loading ? <CircularProgress size={18} color="inherit" /> : "Post"}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;