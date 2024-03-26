import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

function CartView() {
  const [unpaidCartTransactions, setUnpaidCartTransactions] = useState([]);
  const uid = "c4YeICHbkZRMibNNf7DbQb1ceP02"; // Assuming you have a way to obtain the user's UID

  useEffect(() => {
    console.log('UID:', uid); // Log the UID
    if (uid) {
      fetchUnpaidCartTransactions(uid);
    }
  }, [uid]);

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
    } catch (error) {
      console.error('Error fetching unpaid cart transactions:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>購物車</h1>
      <p style={captionStyle}>以下是待結算的購物車列表，請在離開商店前結算。</p>
      <div style={transactionListStyle}>
        {unpaidCartTransactions.length > 0 ? (
          unpaidCartTransactions.map(transaction => (
            <div key={transaction.id} style={cardStyle}>
              <p style={cardTitleStyle}>購物車ID: {transaction.custom_id}</p>
              {/* Render other relevant information */}
            </div>
          ))
        ) : (
          <p>找不到未支付的購物車</p>
        )}
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
