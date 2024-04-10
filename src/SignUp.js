import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore'; // Import Firestore methods
import logo from './777.png';
import eiLogo from './eilogo.png'; // Import the image file

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

      // Set document ID (uid) to match the user's Firebase Authentication UID
      const newUserDocRef = doc(collection(db, 'Users'), userCredential.user.uid);

      // Add user data to Firestore upon successful sign-up
      await setDoc(newUserDocRef, { 
        email: email, 
        uid: userCredential.user.uid,
        qrCode: userCredential.user.uid,
        userId: userCredential.user.uid,
        storeId: "OSP024"
      });

      console.log('User credential:', userCredential);
      console.log('New user document ID (UID):', newUserDocRef.id); // Log the UID of the newly created document
      setEmail('');
      setPassword('');
      setError(null);
      navigate('/myqrcode', { state: { uid: userCredential.user.uid } }); // Pass the UID as a parameter
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

  const logoStyle = {
    position: 'absolute',
    top: '20px', // Adjust as needed
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px', // Adjust the width as needed
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
      <br />
      <img src={logo} alt="Logo" style={logoStyle} /> 
      <br />
       <p style={{ color: 'white' }}>歡迎來到 777士多</p>
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
        <button style={buttonStyle} type="submit">立即登記</button>
      </form>

      {/* Display error message if there's an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Link to privacy policy */}
      <p>註冊即表示您同意我們的 <a href="https://www.everything-intelligence.com/privacy" target="_blank" rel="noopener noreferrer">隱私政策</a></p>

      {/* Already have an account? */}
      <p>已經有帳戶了嗎？ <Link to="/login">立即登入</Link></p>

      {/* Line: POWERED by EVERYTHING INTELLIGENCE, 萬智科技 2024 All rights reserved */}
      <p style={{ fontSize: '13px' }}>POWERED by EVERYTHING INTELLIGENCE  萬智科技 2024 All rights reserved</p>

{/* Add the image with smaller size */}
<img src={eiLogo} alt="EI Logo" style={{ width: '100px', height: 'auto' }} />

    </div>
  );
}

export default SignUp;
