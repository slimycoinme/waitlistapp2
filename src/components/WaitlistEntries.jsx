import React from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Pagination
} from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

const WaitlistEntries = ({ 
  displayedUsers, 
  page, 
  totalPages, 
  handlePageChange 
}) => {
  return (
    <>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mt: 4, 
          color: '#1976d2', 
          fontFamily: 'Poppins, sans-serif', 
          fontWeight: 600 
        }}
      >
        Current Waitlist
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Latest Waitlist Entries
        </Typography>
        {displayedUsers.length > 0 ? (
          <>
            <div style={{ marginBottom: '20px' }}>
              {displayedUsers.map((user, index) => (
                <div
                  key={user.email}
                  style={{
                    padding: '10px',
                    borderBottom: index < displayedUsers.length - 1 ? '1px solid #eee' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Joined: {user.created_at ? new Date(user.created_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Recently'}
                    </Typography>
                    {user.referrals > 0 && (
                      <Typography variant="body2" color="success.main">
                        {user.referrals} referral{user.referrals !== 1 ? 's' : ''}
                      </Typography>
                    )}
                  </div>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                    <Typography variant="body2" color="textSecondary">
                      Code: {user.referral_code}
                    </Typography>
                    <Tooltip title="Copy referral code">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          navigator.clipboard.writeText(user.referral_code);
                          toast.success('Referral code copied!');
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </div>
              ))}
            </div>
            <Stack spacing={2} alignItems="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </>
        ) : (
          <Typography variant="body1" align="center">
            No entries yet. Be the first to join!
          </Typography>
        )}
      </Paper>
    </>
  );
};

export default WaitlistEntries;
