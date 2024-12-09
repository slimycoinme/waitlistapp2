import React from 'react';
import { Box } from '@mui/material';
import {
  Link as LinkIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import FeatureCard from './FeatureCard';

const RightFeatures = () => {
  const features = [
    {
      Icon: LinkIcon,
      title: "Seamless Integration",
      description: "Easily connect your social media accounts and expand your reach across multiple platforms.",
      rotation: 4
    },
    {
      Icon: SecurityIcon,
      title: "Secure Transactions",
      description: "Enjoy peace of mind with secure, encrypted payments and reliable transaction processing.",
      rotation: -3
    },
    {
      Icon: PaletteIcon,
      title: "Customizable Profiles",
      description: "Personalize your profile with unique themes, bio sections, and media to showcase your identity.",
      rotation: 2,
      marginBottom: 0
    }
  ];

  return (
    <Box sx={{ 
      display: { xs: 'none', md: 'block' },
      position: 'fixed',
      right: { md: '20px', lg: '40px' },
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
          marginBottom={feature.marginBottom !== undefined ? feature.marginBottom : 8}
        />
      ))}
    </Box>
  );
};

export default RightFeatures;
