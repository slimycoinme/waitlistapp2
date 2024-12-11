import React, { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { Check as CheckIcon, Google as GoogleIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

const WaitlistForm = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  handleGoogleSignIn, 
  isSigningIn, 
  initialReferralCode, 
  users,
  totalCount = 0
}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrorMessage('Please fix the form errors before submitting.');
      setShowError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await handleSubmit(e);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(error.message || 'An error occurred while submitting the form.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            fontSize: '16px', 
            fontWeight: 'normal',
            color: '#757575'
          }}
        >
          Be among the first to experience our beta product.
        </Typography>
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            fontSize: '16px', 
            fontWeight: 'normal',
            color: '#757575',
            mt: 1
          }}
        >
          Join {totalCount} others already in line!
        </Typography>
      </div>

      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <form onSubmit={onSubmit} className="form-container">
        <TextField
          required
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        />
        <TextField
          required
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Referral Code (Optional)"
          name="referralCode"
          value={formData.referralCode}
          onChange={handleChange}
          fullWidth
          disabled={isSubmitting}
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
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{ 
              mb: 0.5,
              height: '48px',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFB6C1 30%, #FF69B4 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Join Waitlist'
            )}
          </Button>

          <Button
            onClick={handleGoogleSignIn}
            variant="outlined"
            fullWidth
            disabled={isSigningIn || isSubmitting}
            startIcon={isSigningIn ? <CircularProgress size={20} /> : <GoogleIcon />}
            sx={{ height: '48px' }}
          >
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default WaitlistForm;
