import React from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

const formatDate = (dateString) => {
  if (!dateString) return 'Recently';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Recently';
  }
};

const handleCopyReferralCode = async (referralCode) => {
  try {
    await navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  } catch (error) {
    console.error('Failed to copy referral code:', error);
    toast.error('Failed to copy referral code');
  }
};

const WaitlistEntries = ({ 
  users, 
  loading,
  loadMore,
  hasMore,
  totalCount = 0
}) => {
  console.log('WaitlistEntries props:', { users, loading, hasMore, totalCount });

  if (loading && !users.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Waitlist (0 users)
        </Typography>
        <Typography>No entries yet</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Current Waitlist ({totalCount} users)
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Referrals</TableCell>
              <TableCell>Referral Code</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.position || '-'}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.referrals || 0}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {user.referral_code}
                    <Tooltip title="Copy referral code">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyReferralCode(user.referral_code)}
                        sx={{ ml: 1 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <button 
            onClick={loadMore}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Loading...' : `Load More (${users.length} of ${totalCount})`}
          </button>
        </Box>
      )}
    </Paper>
  );
};

export default WaitlistEntries;
