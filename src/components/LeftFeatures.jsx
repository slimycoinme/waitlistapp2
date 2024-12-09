import React from 'react';
import { Box } from '@mui/material';
import { 
  Person as PersonIcon,
  Chat as ChatIcon,
  Star as StarIcon 
} from '@mui/icons-material';
import FeatureCard from './FeatureCard';

const LeftFeatures = () => {
  const features = [
    {
      Icon: PersonIcon,
      title: "Growing Community",
      description: "Connect with millions of users worldwide who share your interests and passions.",
      rotation: -5
    },
    {
      Icon: ChatIcon,
      title: "Direct Engagement",
      description: "Interact directly with your audience through live streams and private messages.",
      rotation: 3
    },
    {
      Icon: StarIcon,
      title: "Exclusive Content",
      description: "Share and monetize your content with our flexible subscription model.",
      rotation: -2,
      marginBottom: 0
    }
  ];

  return (
    <Box sx={{ 
      display: { xs: 'none', md: 'block' },
      position: 'fixed',
      left: { md: '20px', lg: '40px' },
      top: '50%',
      transform: 'translateY(-50%)',
      width: { md: '180px', lg: '225px' },
      zIndex: 1
    }}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          Icon={feature.Icon}
          title={feature.title}
          description={feature.description}
          rotation={feature.rotation}
          marginBottom={feature.marginBottom !== undefined ? feature.marginBottom : 10}
        />
      ))}
    </Box>
  );
};

export default LeftFeatures;
