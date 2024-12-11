import React from 'react';
import { Typography } from '@mui/material';

const Logo = () => {
  return (
    <>
      <div 
        className="logo-container" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%',
          position: 'relative',
          zIndex: 2
        }}
      >
        <img 
          src="/only4u-logo.png" 
          alt="Only4U Logo" 
          style={{ 
            width: 'auto',
            height: 'min(280px, 25vw)',
            maxHeight: 'none',
            objectFit: 'contain'
          }} 
        />
      </div>
      
      <Typography 
        variant="h6" 
        className="slogan" 
        gutterBottom 
        sx={{
          color: '#FFFFFF',
          fontWeight: 600,
          background: 'transparent'
        }}
      >
        Creators Thrive, Fans Engage – Join the Only4U Beta and Discover What's Next in Live-Webcam Streaming! 
        Sign Up Now to Unlock Exclusive Beta-Only Perks and Get a Head Start on the Platform!
      </Typography>

      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 938,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.5px',
          marginBottom: '2rem',
          transition: 'all 1s ease-in-out',
        }}
      >
        Join Our Exclusive Waitlist
      </Typography>
    </>
  );
};

export default Logo;
