import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

function SignUp({ onSignUpSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getFirestore(); // Get Firestore instance

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Add user data to Firestore upon successful sign-up
      const usersCollectionRef = collection(db, 'Users');
      const newUserDocRef = await addDoc(usersCollectionRef, { email: email, uid: userCredential.user.uid });
      
      console.log('User credential:', userCredential);
      console.log('New user document ID:', newUserDocRef.id); // Log the ID of the newly created document
      setEmail('');
      setPassword('');
      setError(null);
      navigate('/myqrcode'); // Redirect to /myqrcode on successful sign-up
    } catch (error) {
      setError(error.message);
      console.error('Error signing up:', error.message);
    }
  };

  const buttonStyle = {
    backgroundColor: '#007AFF',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
  };

  const inputStyle = {
    marginBottom: '20px',
    padding: '10px',
    fontSize: '16px',
    width: '300px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <h1>歡迎來到 AutoShop</h1>
      <p>建立帳戶: 輸入您的電子郵件和密碼以註冊。</p>

      {/* Sign-up form */}
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <br />
        <button style={buttonStyle} type="submit">Sign Up</button>
      </form>

      {/* Display error message if there's an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Already have an account? */}
      <p>已經有帳戶了嗎？ <Link to="/login">立即登入</Link></p>
    </div>
  );
}

export default SignUp;
