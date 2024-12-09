import React, { useState, useEffect } from 'react';
import { Box, Container, Fade, Typography } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Import components
import Logo from './components/Logo';
import WaitlistForm from './components/WaitlistForm';
import WaitlistDialog from './components/WaitlistDialog';
import WaitlistEntries from './components/WaitlistEntries';
import LeftFeatures from './components/LeftFeatures';
import RightFeatures from './components/RightFeatures';

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const initialReferralCode = new URLSearchParams(window.location.search).get('ref');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    referralCode: initialReferralCode || '',
    feedback: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [position, setPosition] = useState(0);
  const [userReferralCode, setUserReferralCode] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Initialize Firebase Authentication
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
  
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
        display: 'popup'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
      
      toast.success('Successfully signed in with Google!');
    } catch (error) {
      console.error('Google sign-in error:', error.message);
      toast.error(`Error signing in with Google: ${error.message}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const pollInterval = setInterval(fetchUsers, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      if (response.data) {
        const sortedUsers = response.data
          .map(user => ({
            ...user,
            created_at: user.created_at ? new Date(user.created_at).toISOString() : new Date().toISOString()
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error('API Error:', error.message);
      toast.error('Unable to load waitlist. Please refresh the page.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users', formData);
      setPosition(response.data.position);
      setUserReferralCode(response.data.referralCode);
      setOpenDialog(true);
      setFormData({ name: '', email: '', referralCode: '', feedback: '' });
      fetchUsers();
      setShowThankYou(true);
      toast.success('Successfully joined the waitlist!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error joining waitlist');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCopyLink = async () => {
    try {
      const referralLink = `https://only4u.com?ref=${userReferralCode}`;
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const usersPerPage = 10;
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (page - 1) * usersPerPage;
  const displayedUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <Container maxWidth="lg">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, py: 3 }}>
          <Logo />
          
          <div className="waitlist-container">
            <WaitlistForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleGoogleSignIn={handleGoogleSignIn}
              isSigningIn={isSigningIn}
              initialReferralCode={initialReferralCode}
            />

            {showThankYou && (
              <Fade in={showThankYou}>
                <Typography 
                  className="waitlist-message" 
                  gutterBottom
                  sx={{ color: '#4CAF50', fontWeight: 500 }}
                >
                  Thank you for joining the Only4U Beta! 🎉 We're thrilled to have you on board as we revolutionize the Live-Webcam Streaming Platform. Stay tuned for updates – exciting opportunities are just around the corner!
                </Typography>
              </Fade>
            )}

            <WaitlistEntries
              displayedUsers={displayedUsers}
              page={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </Container>

        <LeftFeatures />
        <RightFeatures />

        <WaitlistDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          position={position}
          userReferralCode={userReferralCode}
          copiedLink={copiedLink}
          handleCopyLink={handleCopyLink}
        />
      </Box>
    </Container>
  );
}

export default App;
