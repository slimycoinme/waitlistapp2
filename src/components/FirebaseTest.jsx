import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

function FirebaseTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Firebase connection...');
        const waitlistRef = collection(db, 'waitlist');
        const querySnapshot = await getDocs(waitlistRef);
        
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        
        setData(documents);
        setIsConnected(true);
        console.log('Firebase connection successful', documents);
      } catch (err) {
        console.error('Firebase connection error:', err);
        setError(err.message);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Firebase Connection Test</h2>
      {isConnected ? (
        <div>
          <p style={{ color: 'green' }}>✅ Connected to Firebase!</p>
          <p>Found {data.length} documents in waitlist collection</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : error ? (
        <div>
          <p style={{ color: 'red' }}>❌ Error connecting to Firebase:</p>
          <pre style={{ color: 'red' }}>{error}</pre>
        </div>
      ) : (
        <p>Testing connection...</p>
      )}
    </div>
  );
}

export default FirebaseTest; 