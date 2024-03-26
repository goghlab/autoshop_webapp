import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import QRCode from 'qrcode.react';

function MyQRCode() {
  const location = useLocation(); // Get the current location
  const uid = location.state?.uid; 
  const [isActiveQRCode, setIsActiveQRCode] = useState(true);
  const [isActivePaymentHistory, setIsActivePaymentHistory] = useState(false);
  const [isActiveCart, setIsActiveCart] = useState(false);

  console.log('UID:', uid);

  const toggleQRCode = () => {
    setIsActiveQRCode(true);
    setIsActivePaymentHistory(false);
    setIsActiveCart(false);
  };

  const togglePaymentHistory = () => {
    setIsActiveQRCode(false);
    setIsActivePaymentHistory(true);
    setIsActiveCart(false);
  };

  const toggleCart = () => {
    setIsActiveQRCode(false);
    setIsActivePaymentHistory(false);
    setIsActiveCart(true);
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '20px', fontSize: '40px', fontWeight: 'bold' }}>你的 QR 碼</h1>
      <p style={{ marginBottom: '20px', fontSize: '18px', color: '#555' }}>掃碼進入無人便利店</p>
      <div style={{ marginBottom: '20px' }}>
        <QRCode value={uid} size={220} /> {/* Set size to 220 pixels */}
      </div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={toggleQRCode} style={buttonStyle(isActiveQRCode)}>QR Code</button>
        <button onClick={togglePaymentHistory} style={buttonStyle(isActivePaymentHistory)}>付款記錄</button>
        <button onClick={toggleCart} style={buttonStyle(isActiveCart)}>購物車</button>
      </div>

      {isActivePaymentHistory && (
        <p>Payment history content goes here...</p>
      )}
      {isActiveCart && (
        <p>Cart content goes here...</p>
      )}
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
};

const buttonStyle = (isActive) => ({
  padding: '10px 20px',
  borderRadius: '20px',
  backgroundColor: isActive ? '#007AFF' : '#EEE',
  color: isActive ? '#FFF' : '#000',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s',
});

export default MyQRCode;
