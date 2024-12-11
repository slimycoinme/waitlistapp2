import React, { useState, useEffect } from 'react';
import { Box, Container, Fade, Typography } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

// Import components
import Logo from './components/Logo';
import WaitlistForm from './components/WaitlistForm';
import WaitlistDialog from './components/WaitlistDialog';
import WaitlistEntries from './components/WaitlistEntries';
import LeftFeatures from './components/LeftFeatures';
import RightFeatures from './components/RightFeatures';
import MouseFollower from './components/MouseFollower';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <Box sx={{ mt: 4, p: 3, bgcolor: '#ffebee', borderRadius: 2 }}>
            <Typography variant="h5" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography color="error">
              {this.state.error?.message || 'Unknown error occurred'}
            </Typography>
          </Box>
        </Container>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const { displayName, email } = JSON.parse(savedUser);
      return {
        name: displayName || '',
        email: email || '',
        referralCode: '',
        feedback: ''
      };
    }
    return {
      name: '',
      email: '',
      referralCode: '',
      feedback: ''
    };
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [position, setPosition] = useState(0);
  const [userReferralCode, setUserReferralCode] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const auth = getAuth();

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
      console.error('Google sign-in error:', error);
      toast.error(`Error signing in with Google: ${error.message}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  const fetchUsers = async (startAfterDoc = null) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching users...', { startAfterDoc });
      
      const response = await axios.get('/api/users', {
        params: {
          startAfter: startAfterDoc ? JSON.stringify(startAfterDoc) : undefined,
          limit: 25
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const { users: newUsers, lastDoc: newLastDoc, totalCount: newTotalCount } = response.data;
      
      if (!Array.isArray(newUsers)) {
        throw new Error('Invalid data format received');
      }
      
      if (startAfterDoc) {
        setUsers(prev => [...prev, ...newUsers]);
      } else {
        setUsers(newUsers);
      }
      
      setLastDoc(newLastDoc);
      setTotalCount(newTotalCount);
      setHasMore(newLastDoc !== null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore && lastDoc) {
      fetchUsers(lastDoc);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form:', formData);
      const response = await axios.post('/api/users', formData);
      console.log('Submit response:', response.data);
      
      // Get user data from response
      const userData = response.data.user;
      setPosition(userData.position);
      setUserReferralCode(userData.referral_code); 
      setOpenDialog(true);
      setFormData({ name: '', email: '', referralCode: '', feedback: '' });
      await fetchUsers();
      setShowThankYou(true);
      toast.success('Successfully joined the waitlist!');
    } catch (error) {
      console.error('Submit error:', error);
      if (error.response?.status === 409) {
        toast.error('This email is already registered. Please use a different email address.');
      } else {
        toast.error(error.response?.data?.error || 'Error joining waitlist');
      }
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
      const referralLink = `${window.location.origin}?ref=${userReferralCode}`;
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy link');
    }
  };

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4, p: 3, bgcolor: '#ffebee', borderRadius: 2 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error
          </Typography>
          <Typography color="error">{error}</Typography>
          <button onClick={() => fetchUsers()}>Retry</button>
        </Box>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <MouseFollower />
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
                  users={users}
                  totalCount={totalCount}
                />

                {showThankYou && (
                  <Fade in={showThankYou} timeout={1000}>
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        Thank you for joining!
                      </Typography>
                      <Typography variant="body1">
                        Share your referral link to move up in the waitlist.
                      </Typography>
                    </Box>
                  </Fade>
                )}

                <WaitlistDialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  position={position}
                  userReferralCode={userReferralCode}
                  copiedLink={copiedLink}
                  handleCopyLink={handleCopyLink}
                />

                <WaitlistEntries
                  users={users}
                  loading={loading}
                  loadMore={loadMore}
                  hasMore={hasMore}
                  totalCount={totalCount}
                />
              </div>
            </Container>

            <LeftFeatures />
            <RightFeatures />
          </Box>
        </Container>
      </div>
    </ErrorBoundary>
  );
}

export default App;
