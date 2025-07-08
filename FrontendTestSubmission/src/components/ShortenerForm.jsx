import React, { useState } from 'react';
import { Log } from '../../../LoggingMiddleware/index';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function ShortenerForm() {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [error, setError] = useState('');
  const [shortened, setShortened] = useState([]); 

  const handleChange = (idx, field, value) => {
    const updated = [...urls];
    updated[idx][field] = value;
    setUrls(updated);
  };

  const addUrlInput = () => {
    if (urls.length < 5) setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
  };

  const generateShortcode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const isShortcodeUnique = (code) => {
    return !shortened.some(item => item.shortcode === code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let newShortened = [];
    for (const input of urls) {
      try {
        new URL(input.url);
        if (input.validity && isNaN(Number(input.validity))) throw new Error('Validity must be a number');
        let code = input.shortcode.trim();
        if (code) {
          if (!/^[a-zA-Z0-9]{3,16}$/.test(code)) throw new Error('Shortcode must be alphanumeric and 3-16 chars');
          if (!isShortcodeUnique(code)) throw new Error('Shortcode already exists');
        } else {
          do {
            code = generateShortcode();
          } while (!isShortcodeUnique(code));
        }
        const now = new Date();
        const mins = input.validity ? parseInt(input.validity) : 30;
        const expiry = new Date(now.getTime() + mins * 60000);
        newShortened.push({
          url: input.url,
          shortcode: code,
          createdAt: now.toISOString(),
          expiresAt: expiry.toISOString(),
        });
      } catch (err) {
        setError(err.message || 'Invalid input detected');
        await Log('frontend', 'error', 'component', `Shorten error: ${err.message}`);
        return;
      }
    }
    await Log('frontend', 'info', 'component', 'URLs shortened successfully');
    setShortened(prev => [...prev, ...newShortened]);
    setUrls([{ url: '', validity: '', shortcode: '' }]);
  };

  React.useEffect(() => {
    localStorage.setItem('shortenedLinks', JSON.stringify(shortened));
  }, [shortened]);

  return (
    <Box sx={{
      minHeight: '80vh',
      width: '98vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexDirection: 'row',
      gap: 6,
    }}>
      <Box component="form" onSubmit={handleSubmit} sx={{
        p: 4,
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        minWidth: 840,
        maxWidth: 400,
        width: 400,
        height: 300,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#fff',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#fff', fontWeight: 700, letterSpacing: 1 }}>Shorten URLs</Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {urls.map((input, idx) => (
            <Box key={idx} sx={{ mb: 2, position: 'relative', background: 'none' }}>
              <Box sx={{ flex: 1, position: 'relative' }}>
                <TextField
                  label="Long URL"
                  value={input.url}
                  onChange={e => handleChange(idx, 'url', e.target.value)}
                  required
                  fullWidth
                  sx={{ mb: 1 }}
                  InputProps={{ style: { color: '#fff' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                />
                <TextField
                  label="Validity (minutes, optional)"
                  value={input.validity}
                  onChange={e => handleChange(idx, 'validity', e.target.value)}
                  type="number"
                  sx={{ mb: 1, mr: 1 }}
                  InputProps={{ style: { color: '#fff' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                />
                <TextField
                  label="Custom Shortcode (optional)"
                  value={input.shortcode}
                  onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                  sx={{ mb: 1 }}
                  InputProps={{ style: { color: '#fff' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                />
                {urls.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ position: 'absolute', bottom: 16, right: 0, zIndex: 2, borderColor: '#fff', color: '#fff', minWidth: 32, width: 32, height: 32, p: 0 }}
                    onClick={() => {
                      setUrls(urls.filter((_, i) => i !== idx));
                    }}
                    aria-label="Remove URL"
                  >
                    &#10005;
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
          {urls.length < 5 && (
            <Button onClick={addUrlInput} variant="outlined" sx={{ color: '#fff', borderColor: '#fff', backdropFilter: 'blur(4px)', flex: 1 }}>
              Add Another URL
            </Button>
          )}
          <Button type="submit" variant="contained" sx={{ background: 'rgba(0, 123, 255, 0.7)', color: '#fff', fontWeight: 600, boxShadow: 'none', ':hover': { background: 'rgba(0, 123, 255, 1)' }, flex: 1 }}>
            Shorten
          </Button>
        </Box>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Box>
      <Box sx={{ ml: 6, width: '100%', maxWidth: 400, zIndex: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>Shortened Links</Typography>
        {shortened.length === 0 ? (
          <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.10)', color: '#fff', backdropFilter: 'blur(8px)', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: '#bbb', textAlign: 'center' }}>
              Shortened URLs will appear here.
            </Typography>
          </Box>
        ) : (
          shortened.map((item, idx) => (
            <Box key={idx} sx={{ mb: 2, p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.10)', color: '#fff', backdropFilter: 'blur(8px)' }}>
              <Typography sx={{ color: '#fff' }}><b>Original:</b> {item.url}</Typography>
              <Typography sx={{ color: '#fff' }}>
                <b>Short URL:</b>{' '}
                <a
                  href={window.location.origin + '/' + item.shortcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2196f3', textDecoration: 'underline', wordBreak: 'break-all' }}
                >
                  {window.location.origin + '/' + item.shortcode}
                </a>
              </Typography>
              <Typography sx={{ color: '#fff' }}><b>Created:</b> {new Date(item.createdAt).toLocaleString()}</Typography>
              <Typography sx={{ color: '#fff' }}><b>Expires:</b> {new Date(item.expiresAt).toLocaleString()}</Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
