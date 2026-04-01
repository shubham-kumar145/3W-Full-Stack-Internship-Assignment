import api from "./api";

export const getPostsService = async (page = 1, limit = 10) => {
  const res = await api.get(`/posts?page=${page}&limit=${limit}`);
  return res.data;
};

export const createPostService = async (formData) => {
  const res = await api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const toggleLikeService = async (postId) => {
  const res = await api.put(`/posts/${postId}/like`);
  return res.data;
};

export const addCommentService = async (postId, comment) => {
  const res = await api.post(`/posts/${postId}/comment`, { comment });
  return res.data;
};4