import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Container, Typography, CircularProgress,
  Alert, Button, Divider,
} from "@mui/material";
import { getPostsService } from "../services/post.service";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const data = await getPostsService(pageNum, 10);

      setPosts((prev) => append ? [...prev, ...data.posts] : data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    // Optimistic UI: prepend to feed immediately
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  return (
    <Box minHeight="100vh" bgcolor="#f5f7fa" pt={3} pb={6}>
      <Container maxWidth="sm">
        {/* Create Post */}
        {isAuthenticated && <CreatePost onPostCreated={handlePostCreated} />}

        {/* Feed header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
            {posts.length > 0 ? `Feed · ${pagination?.totalPosts || posts.length} posts` : "Feed"}
          </Typography>
          <Button size="small" onClick={() => fetchPosts(1)} sx={{ textTransform: "none", fontSize: 12 }}>
            Refresh
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Loading state */}
        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {/* Error state */}
        {!loading && error && (
          <Alert severity="error" action={<Button size="small" onClick={() => fetchPosts(1)}>Retry</Button>}>
            {error}
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !error && posts.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h2" mb={1}>🌱</Typography>
            <Typography variant="h6" fontWeight={700} color="text.secondary">No posts yet</Typography>
            <Typography variant="body2" color="text.disabled" mt={0.5}>
              {isAuthenticated ? "Be the first to share something!" : "Login to create a post"}
            </Typography>
          </Box>
        )}

        {/* Post feed */}
        {!loading && posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

        {/* Load more */}
        {!loading && pagination?.hasNextPage && (
          <Box textAlign="center" mt={3}>
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={loadingMore}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              {loadingMore ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
              {loadingMore ? "Loading..." : "Load more posts"}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;