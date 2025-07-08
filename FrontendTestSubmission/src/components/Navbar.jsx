import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  return (
    <Box sx={{
      position: 'fixed',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      width: '93vw',
      maxWidth: 1700,
      borderRadius: 4,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.18)',
      overflow: 'hidden',
    }}>
      <AppBar position="static" elevation={0} sx={{
        background: 'transparent',
        boxShadow: 'none',
      }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', fontWeight: 700 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={{ color: location.pathname === '/' ? '#2196f3' : '#fff', fontWeight: 600 }}>Shorten</Button>
          <Button color="inherit" component={Link} to="/stats" sx={{ color: location.pathname === '/stats' ? '#2196f3' : '#fff', fontWeight: 600 }}>Statistics</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
