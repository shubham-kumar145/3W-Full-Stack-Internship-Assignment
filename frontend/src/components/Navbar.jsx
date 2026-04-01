import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Avatar,
  Menu, MenuItem, Box, useTheme, useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Generate consistent avatar color from username
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 60%, 45%)`;
};

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => { handleClose(); logout(); navigate("/login"); };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#fff", borderBottom: "1px solid #e0e0e0" }}>
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ flexGrow: 1, cursor: "pointer", color: "#1976d2", letterSpacing: "-0.5px" }}
          onClick={() => navigate("/")}
        >
          🌐 SocialApp
        </Typography>

        {isAuthenticated ? (
          <Box display="flex" alignItems="center" gap={1}>
            {!isMobile && (
              <Typography variant="body2" color="text.secondary">
                @{user?.username}
              </Typography>
            )}
            <IconButton onClick={handleMenu} size="small">
              <Avatar
                sx={{ width: 36, height: 36, bgcolor: stringToColor(user?.username || "U"), fontSize: 14, fontWeight: 700 }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem disabled>
                <Typography variant="body2" fontWeight={600}>@{user?.username}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button onClick={() => navigate("/login")} size="small">Login</Button>
            <Button onClick={() => navigate("/signup")} variant="contained" size="small">Sign Up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;