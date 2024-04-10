import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from './AuthContext'; // Import useAuth hook from AuthContext
import logo from './777.png';
import eiLogo from './eilogo.png'; // Import the image file

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth(); // Access user information from AuthContext  

  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in user with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Clear the form fields
      setEmail('');
      setPassword('');
      setError(null);

      // Redirect to a different page upon successful login
      navigate('/myqrcode'); // Change '/dashboard' to your desired route
    
      // Log the UID of the authenticated user
      console.log('Authenticated user UID:', user.uid);
    } catch (error) {
      setError(error.message);
      console.error('Error logging in:', error.message);
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
    marginBottom: '20px auto',
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
      <img src={logo} alt="Logo" style={logoStyle} /> 
      <br></br>
      <br></br>
      <p>歡迎來到 777士多</p>
      <p>登入帳戶: 輸入您的電子郵件和密碼以登入。</p>

      {/* Login form */}
      <form onSubmit={handleLogin}>
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
        <button style={buttonStyle} type="submit">立即登入</button>
      </form>

      {/* Display error message if there's an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Link to sign up */}
      <p>還沒有帳戶?？ <Link to="/signup">立即註冊</Link></p>
       {/* Line: POWERED by EVERYTHING INTELLIGENCE, 萬智科技 2024 All rights reserved */}
       <p style={{ fontSize: '13px' }}>POWERED by EVERYTHING INTELLIGENCE . 萬智科技 2024 All rights reserved</p>

   {/* Add the image with smaller size */}
<img src={eiLogo} alt="EI Logo" style={{ width: '100px', height: 'auto' }} />

    </div>
  );
}

export default Login;
