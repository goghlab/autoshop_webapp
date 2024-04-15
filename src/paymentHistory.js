import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function PaymentHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paidTransactions, setPaidTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPaidTransactions(user.uid);
    }
  }, [user]);

  const fetchPaidTransactions = async (uid) => {
    try {
      const db = getFirestore();
      const paidTransactionsRef = collection(db, 'Users', uid, 'cartTransactions'); // Assuming the collection name is 'paymentHistory'
      const q = query(paidTransactionsRef, where('paid', '==', true));
      const querySnapshot = await getDocs(q);

      const paidTransactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPaidTransactions(paidTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching paid transactions:', error);
      setLoading(false);
    }
  };

  const handleTransactionItemClick = (transactionId) => {
    navigate(`/payment-detail/${transactionId}`); // Assuming payment detail route is '/payment-detail/:transactionId'
  };

  return (
    <div style={containerStyle}>
      <h5 style={titleStyle}>我的付款記錄</h5>
      <div style={transactionListStyle}>
        {loading ? (
          <p> 正在載入付款記錄...</p>
        ) : (
          paidTransactions.length > 0 ? (
            paidTransactions.map(transaction => (
              <div key={transaction.id} style={cardStyle} onClick={() => handleTransactionItemClick(transaction.id)}>
                <p style={cardTitleStyle}>💳 付款ID: {transaction.custom_id}</p>
                {/* Render other relevant information */}
              </div>
            ))
          ) : (
            <p>找不到付款歷史.</p>
          )
        )}
      </div>
    </div>
  );
}

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

export default PaymentHistory;
