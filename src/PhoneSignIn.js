import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Ensure this path is correct
import './PhoneSignIn.css'; // Import the CSS file
import logo from './777.png';

const PhoneSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState('+852'); // Default to +852
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null); // Added state for confirmation result
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const setupRecaptcha = () => {
    try {
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        throw new Error('Recaptcha container is missing.');
      }

      const recaptchaVerifier = new RecaptchaVerifier(auth, container, {
        size: 'invisible',
        callback: (response) => {
          console.log('Recaptcha solved, allow phone number verification.');
        },
        'expired-callback': () => {
          console.log('Recaptcha expired, please try again.');
        }
      });

      recaptchaVerifier.render().then(() => {
        console.log('RecaptchaVerifier rendered successfully.');
      }).catch((error) => {
        console.error('Error rendering RecaptchaVerifier:', error);
        setError('初始化 reCAPTCHA 時出錯。請檢查您的網絡連接，然後重試。');
      });

      window.recaptchaVerifier = recaptchaVerifier;

    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      setError('初始化 reCAPTCHA 時出錯。請檢查您的網絡連接，然後重試。');
    }
  };

  const sendOtp = async () => {
    if (!phoneNumber) {
      setError('請輸入手機號碼。');
      return;
    }

    setLoading(true);
    const appVerifier = window.recaptchaVerifier;

    if (!appVerifier) {
      console.error('RecaptchaVerifier is not initialized.');
      setError('初始化 reCAPTCHA 失敗。請重試。');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending OTP to:', phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      console.log('OTP sent successfully:', confirmationResult);
      setConfirmationResult(confirmationResult); // Save confirmationResult
      alert('OTP 已發送！');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(`發送 OTP 失敗：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!verificationCode) {
      setError('請輸入 OTP。');
      return;
    }

    if (!confirmationResult) {
      setError('未發送 OTP。請重新請求 OTP。');
      return;
    }

    try {
      await confirmationResult.confirm(verificationCode);
      alert('手機號碼驗證成功！');
      navigate('/myqrcode'); // Redirect to MyQRCode page
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(`驗證 OTP 失敗：${error.message}`);
    }
  };

  return (
    <div className="phone-signin-container">
      <div id="recaptcha-container"></div>
      <h2>手機登入</h2>
      <input
        type="text"
        placeholder="輸入手機號碼"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={sendOtp} disabled={loading}>
        {loading ? '正在發送 OTP...' : '發送 OTP'}
      </button>
      {error && <p className="error">{error}</p>}
      
      {confirmationResult && (
        <div className="verification-section">
          <input
            type="text"
            placeholder="輸入 OTP"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button onClick={verifyOtp}>
            驗證 OTP
          </button>
        </div>
      )}
    </div>
  );
};

export default PhoneSignIn;
