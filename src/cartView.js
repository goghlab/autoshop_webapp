import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

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
      const q = query(cartTransactionsRef, where('paid', '==', false));
      const querySnapshot = await getDocs(q);

      const unpaidTransactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUnpaidCartTransactions(unpaidTransactions);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching unpaid cart transactions:', error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const handleTransactionItemClick = (cartItemId) => {
    navigate(`/cart-detail/${cartItemId}`); // Use navigate to go to cart detail
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
              <div key={transaction.id} style={cardStyle} onClick={() => handleTransactionItemClick(transaction.id)}>
                <p style={cardTitleStyle}>🛒購物車ID: {transaction.custom_id}</p>
                {/* Render other relevant information */}
              </div>
            ))
          ) : (
            <p>找不到未支付的購物車.</p>
          )
        )}
      </div>
    </div>
  );
}

// Styles and export omitted for brevity


// Styles and export omitted for brevity



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

export default CartView;
