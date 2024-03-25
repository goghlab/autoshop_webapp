import React from 'react';

function MyQRCode() {
  return (
    <div style={containerStyle}>
      <h1>Your QR Code</h1>
      <p>Here you can display your QR code or any relevant content.</p>
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

export default MyQRCode;
