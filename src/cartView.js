import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
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
        isEmpty: true, // Flag to differentiate empty carts
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
    const db = getFirestore();
  
    if (transaction.isEmpty) {
      // Handle empty cart deletion
      try {
        await deleteDoc(doc(db, 'Users', user.uid, 'emptyCartTransactions', transaction.id));
        
        // Remove it from state
        setUnpaidCartTransactions((prevTransactions) =>
          prevTransactions.filter((t) => t.id !== transaction.id)
        );

        // Redirect to an external URL
        window.location.href = `https://www.everything-intelligence.com/exit/?cart=${transaction.id}`;
        
      } catch (error) {
        console.error('Error deleting empty cart transaction:', error);
      }
    } else {
      // Navigate to CartDetailView for unpaid carts
      navigate(`/cart-detail/${transaction.id}`);
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
                  {transaction.isEmpty ? (
                    '🛒購物車ID: 空購物車'
                  ) : (
                    `🛒購物車ID: ${transaction.custom_id}`
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
