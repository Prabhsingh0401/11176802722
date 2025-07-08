import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Log } from '../../../LoggingMiddleware/index';

export default function RedirectHandler() {
  const { shortcode } = useParams();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('shortenedLinks') || '[]');
    const found = data.find(item => item.shortcode === shortcode);
    if (found) {
      const stats = JSON.parse(localStorage.getItem('shortenedStats') || '{}');
      if (!stats[shortcode]) {
        stats[shortcode] = { count: 0, clicks: [] };
      }
      stats[shortcode].count += 1;
      stats[shortcode].clicks.push({
        timestamp: new Date().toISOString(),
        source: document.referrer || 'direct',
      });
      localStorage.setItem('shortenedStats', JSON.stringify(stats));
      Log('frontend', 'info', 'component', `Redirecting for shortcode: ${shortcode}`);
      setTimeout(() => {
        window.location.href = found.url;
      }, 1200);
    } else {
      Log('frontend', 'warn', 'component', `Shortcode not found: ${shortcode}`);
    }
  }, [shortcode]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{
        color: '#fff',
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: 2,
        animation: 'pulse 1.2s infinite',
      }}>
        Redirecting...
      </span>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
