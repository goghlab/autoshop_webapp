import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { FaSync } from 'react-icons/fa'; // Import the refresh icon


function CartView() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [unpaidCartTransactions, setUnpaidCartTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

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
        getDocs(emptyCartQuery)
      ]);
  
      const unpaidCartTransactions = cartSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      const emptyCartTransactions = emptyCartSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      const allTransactions = unpaidCartTransactions.concat(emptyCartTransactions);
  
      setUnpaidCartTransactions(allTransactions);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching unpaid cart transactions:', error);
      setLoading(false); // Set loading to false in case of error
    }
  };
  
// Inside the handleTransactionItemClick function
const handleTransactionItemClick = async (transaction) => {
  if (transaction.items && transaction.items.length > 0) {
    // Non-empty cart, navigate to cart detail
    navigate(`/cart-detail/${transaction.id}`);
  } else {
    // Empty cart, navigate to the exit link
    window.location.href = `https://www.everything-intelligence.com/exit/`;
    // Delete the empty cart transaction after navigating
    try {
      const db = getFirestore();
      const emptyCartDocRef = doc(db, 'Users', user.uid, 'emptyCartTransactions', transaction.id);
      await deleteDoc(emptyCartDocRef);
      console.log('Empty cart transaction deleted successfully.');
    } catch (error) {
      console.error('Error deleting empty cart transaction:', error);
    }
  }
};

  

  const handleRefresh = () => {
    setLoading(true); // Set loading to true before fetching data
    if (user) {
      fetchUnpaidCartTransactions(user.uid);
    }
  };

  return (
    <div style={containerStyle}>
      <h5 style={titleStyle}>我的購物車</h5>
      <div style={transactionListStyle}>
        {loading ? ( // Render loading animation if loading is true
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
                {/* Render other relevant information */}
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

const captionStyle = {
  marginBottom: '20px',
  fontSize: '16px',
  color: '#666',
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
  backgroundColor: '#007AFF', // Blue color
  borderRadius: '50%', // Make the button round
  width: '40px',
  height: '40px',
  border: 'none',
  cursor: 'pointer',
  marginTop: '20px',
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white', // Set the color of the icon to white
};

export default CartView;
