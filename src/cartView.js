import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import { FaSync } from 'react-icons/fa'; 

function CartView() {
  const { user } = useAuth(); // Get the authenticated user
  const navigate = useNavigate(); 
  const [unpaidCartTransactions, setUnpaidCartTransactions] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (user) {
      fetchUnpaidCartTransactions(user.uid);
    }
  }, [user]);

  const fetchUnpaidCartTransactions = async (uid) => {
    try {
      const db = getFirestore();
      const cartTransactionsRef = collection(db, 'Users', uid, 'cartTransactions');
      const emptyCartTransactionsRef = collection(db, 'Users', uid, 'emptyCartTransactions');
  
      const cartQuery = query(cartTransactionsRef, where('paid', '==', false));
      const emptyCartQuery = query(emptyCartTransactionsRef);
  
      const [cartSnapshot, emptyCartSnapshot] = await Promise.all([
        getDocs(cartQuery),
        getDocs(emptyCartQuery),
      ]);
  
      const unpaidCartTransactions = cartSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const emptyCartTransactions = emptyCartSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Set state with both unpaid and empty carts
      setUnpaidCartTransactions(unpaidCartTransactions.concat(emptyCartTransactions));
      setLoading(false);
  
    } catch (error) {
      console.error('Error fetching unpaid cart transactions:', error);
      setLoading(false);
    }
  };

  const handleTransactionItemClick = async (transaction) => {
    if (transaction.items && transaction.items.length > 0) {
      navigate(`/cart-detail/${transaction.id}`);
    } else {
      window.location.href = `https://www.everything-intelligence.com/exit/`;
      // Optionally, handle empty cart transactions if needed
    }
  };

  const handleRefresh = () => {
    setLoading(true); 
    if (user) {
      fetchUnpaidCartTransactions(user.uid);
    }
  };

  return (
    <div style={containerStyle}>
      <h5 style={titleStyle}>我的購物車</h5>
      <div style={transactionListStyle}>
        {loading ? ( 
          <p>🛒購物車新增中...</p>
        ) : (
          unpaidCartTransactions.length > 0 ? (
            unpaidCartTransactions.map(transaction => (
              <div key={transaction.id} style={cardStyle} onClick={() => handleTransactionItemClick(transaction)}>
                <p style={cardTitleStyle}>
                  {transaction.items && transaction.items.length > 0 ? (
                    `🛒購物車ID: ${transaction.custom_id}`
                  ) : (
                    '🛒購物車ID: 空購物車'
                  )}
                </p>
              </div>
            ))
          ) : (
            <p>找不到未支付的購物車.</p>
          )
        )}
      </div>
      <button style={refreshButtonStyle} onClick={handleRefresh}><FaSync /></button>
    </div>
  );
}

// Styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
};

const titleStyle = {
  marginBottom: '20px',
  fontSize: '30px',
  fontWeight: 'bold',
};

const transactionListStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
};

const cardTitleStyle = {
  marginBottom: '10px',
  fontSize: '18px',
  fontWeight: 'bold',
};

const refreshButtonStyle = {
  backgroundColor: '#007AFF', 
  borderRadius: '50%', 
  width: '40px',
  height: '40px',
  border: 'none',
  cursor: 'pointer',
  marginTop: '20px',
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white', 
};

export default CartView;
