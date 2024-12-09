import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const WaitlistDialog = ({ 
  open, 
  onClose, 
  position, 
  userReferralCode, 
  copiedLink, 
  handleCopyLink 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#ff9ee6',
          maxWidth: '400px',
          width: '90%',
          borderRadius: '10px',
          padding: '20px',
          '& .MuiDialogTitle-root': {
            color: 'white',
            textAlign: 'center',
            fontWeight: 600
          },
          '& .MuiDialogContentText-root': {
            color: 'white',
            textAlign: 'center'
          }
        }
      }}
    >
      <div className="popup-logo-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '10px' 
      }}>
        <img 
          src="/only4u-logo.png" 
          alt="Only4U Logo" 
          style={{ 
            width: 'auto',
            height: '100px',
            objectFit: 'contain'
          }} 
        />
      </div>
      <DialogTitle>Share Your Referral Link!</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 2 }}>
          Your position: #{position}
        </DialogContentText>
        <DialogContentText>
          Share this link with friends to move up the waitlist:
        </DialogContentText>
        <Paper 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            margin: '10px 0',
            background: 'rgba(255, 255, 255, 0.9)',
            justifyContent: 'space-between'
          }}
        >
          <Typography 
            sx={{ 
              flexGrow: 1, 
              marginRight: 1,
              color: '#ff9ee6',
              fontWeight: 500
            }}
          >
            https://only4u.com?ref={userReferralCode}
          </Typography>
          <Tooltip title={copiedLink ? "Copied!" : "Copy link"}>
            <IconButton onClick={handleCopyLink} size="small">
              {copiedLink ? <CheckIcon /> : <ContentCopyIcon />}
            </IconButton>
          </Tooltip>
        </Paper>
        <DialogContentText sx={{ fontSize: '0.9rem', marginTop: 2 }}>
          Each referral moves you up in the waitlist!
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistDialog;
