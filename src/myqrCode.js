import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { useAuth } from './AuthContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const buttonStyle = {
  fontSize: '15px',
  marginTop: '20px',
  cursor: 'pointer',
  outline: 'none', // Remove button outline
};

const blueButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#0078FA',
  color: 'white',
};

function MyQRCode() {
  const { user } = useAuth();
  const [paidItems, setPaidItems] = useState([]);
  const [isActiveQRCode, setIsActiveQRCode] = useState(true);
  const [isActivePaymentHistory, setIsActivePaymentHistory] = useState(false);
  const [isActiveCart, setIsActiveCart] = useState(false);

  useEffect(() => {
    const fetchPaidItems = async () => {
      if (!user || !user.uid) return;

      const db = getFirestore();
      const q = query(collection(db, 'payments'), where('userId', '==', user.uid), where('paid', '==', true));
      
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      
      setPaidItems(items);
    };

    fetchPaidItems();
  }, [user]);

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
      <h1 style={{ marginBottom: '20px', fontSize: '30px', fontWeight: 'bold' }}>我的QR碼</h1>
      <p style={{ marginBottom: '20px', fontSize: '14px', color: '#555' }}>掃碼進入無人便利店</p>
      <div style={{ marginBottom: '20px' }}>
        {user && user.uid && <QRCode value={user.uid} size={260} />}
      </div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={toggleQRCode} style={isActiveQRCode ? blueButtonStyle : buttonStyle}>QR Code</button>
        <Link to="/paymentHistory">
          <button onClick={togglePaymentHistory} style={isActivePaymentHistory ? blueButtonStyle : buttonStyle}>付款記錄</button>
        </Link>
        <Link to="/cartView">
          <button onClick={toggleCart} style={isActiveCart ? blueButtonStyle : buttonStyle}>購物車</button>
        </Link>
      </div>

      <div>
        {isActivePaymentHistory && paidItems.map(item => (
          <p key={item.id}>{item.name}: ${item.price}</p>
        ))}
      </div>
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
