import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export default function StatsPage() {
  const [shortened, setShortened] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('shortenedLinks') || '[]');
    setShortened(data);
    const statsData = JSON.parse(localStorage.getItem('shortenedStats') || '{}');
    setStats(statsData);
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 0,
      flexDirection: 'column',
    }}>
      <Box sx={{
        p: 4,
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        minWidth: 350,
        maxWidth: 1350,
        width: '100%',
        height: 'auto',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#fff',
        zIndex: 1,
      }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#fff', fontWeight: 700, letterSpacing: 1 }}>Shortened URL Statistics</Typography>
        {shortened.length === 0 ? (
          <Typography sx={{ color: '#fff' }}>No shortened URLs found.</Typography>
        ) : (
          shortened.map((item, idx) => (
            <Box key={idx} sx={{ mb: 2, p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.10)', color: '#fff', backdropFilter: 'blur(8px)' }}>
              <Typography sx={{ color: '#fff' }}><b>Original:</b> {item.url}</Typography>
              <Typography sx={{ color: '#fff' }}><b>Short URL:</b> {window.location.origin + '/' + item.shortcode}</Typography>
              <Typography sx={{ color: '#fff' }}><b>Created:</b> {new Date(item.createdAt).toLocaleString()}</Typography>
              <Typography sx={{ color: '#fff' }}><b>Expires:</b> {new Date(item.expiresAt).toLocaleString()}</Typography>
              <Typography sx={{ color: '#fff' }}><b>Clicks:</b> {stats[item.shortcode]?.count || 0}</Typography>
              {stats[item.shortcode]?.clicks?.length > 0 && (
                <Box sx={{ mt: 1, ml: 1 }}>
                  <Typography sx={{ color: '#bbb', fontWeight: 600 }}>Click Details:</Typography>
                  {stats[item.shortcode].clicks.map((click, cidx) => (
                    <Typography key={cidx} sx={{ color: '#bbb', fontSize: 13 }}>
                      {new Date(click.timestamp).toLocaleString()} — Source: {click.source}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
