import React from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

const WaitlistForm = ({ formData, handleChange, handleSubmit, handleGoogleSignIn, isSigningIn, initialReferralCode }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit} className="form-container">
        <TextField
          required
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          required
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Referral Code (Optional)"
          name="referralCode"
          value={formData.referralCode}
          onChange={handleChange}
          fullWidth
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': initialReferralCode ? {
              '& fieldset': {
                borderColor: '#4CAF50',
                borderWidth: '2px'
              }
            } : {}
          }}
          InputProps={{
            endAdornment: initialReferralCode && (
              <CheckIcon sx={{ color: '#4CAF50' }} />
            )
          }}
          helperText={initialReferralCode ? "Referral code applied!" : ""}
        />
        <TextField
          label="Your Thoughts (Optional)"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ 
            mb: 0.5,
            '&:hover': {
              background: 'linear-gradient(45deg, #FFB6C1 30%, #FF69B4 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)',
              transition: 'all 0.3s ease-in-out'
            }
          }}
        >
          Join Waitlist
        </Button>

        <Typography variant="body2" align="center" sx={{ mb: 0.5, color: '#757575' }}>
          - OR -
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          sx={{
            backgroundColor: '#ffffff',
            color: '#757575',
            border: '1px solid #dadce0',
            textTransform: 'none',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '16px',
            height: '48px',
            '&:hover': {
              background: 'linear-gradient(45deg, #FFB6C1 30%, #FF69B4 90%)',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)',
              transition: 'all 0.3s ease-in-out'
            }
          }}
          startIcon={
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google"
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
          }
        >
          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </form>
    </Paper>
  );
};

export default WaitlistForm;
