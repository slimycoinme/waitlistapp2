import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const FeatureCard = ({ 
  Icon, 
  title, 
  description, 
  rotation, 
  marginBottom = 8 
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: { md: 1.5, lg: 2 },
        mb: marginBottom,
        transform: `rotate(${rotation}deg)`,
        transition: 'all 0.3s ease',
        bgcolor: 'rgba(18, 18, 18, 0.8)',
        borderRadius: 2,
        '&:hover': {
          transform: 'rotate(0deg) scale(1.02)',
          background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)',
          boxShadow: '0 4px 20px rgba(123, 31, 162, 0.5)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Icon sx={{ color: '#FF69B4', fontSize: { md: 24, lg: 30 }, mr: 1 }} />
        <Typography variant="h6" sx={{ 
          fontSize: { md: '0.7rem', lg: '0.9rem' },
          fontWeight: 600,
          color: 'white'
        }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ 
        fontSize: { md: '0.8rem', lg: '0.875rem' },
        color: 'rgba(255,255,255,0.7)'
      }}>
        {description}
      </Typography>
    </Paper>
  );
};

export default FeatureCard;
