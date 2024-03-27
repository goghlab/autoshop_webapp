import React, { useEffect, useState, useContext } from 'react';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Assuming you have AuthContext that provides user ID

function CartDetailView() {
  const { cartItemId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        console.log('Fetching cart items...');
    
        if (!user) {
          console.log('User not available, exiting...');
          return;
        }
    
        const db = getFirestore();
        const userRef = doc(db, 'Users', user.uid); // Use actual user ID from AuthContext
        console.log('User reference:', userRef);
    
        const cartTransactionsQuery = query(collection(userRef, 'cartTransactions'));
        console.log('Cart transactions query:', cartTransactionsQuery);
    
        const querySnapshot = await getDocs(cartTransactionsQuery);
        console.log('Query snapshot:', querySnapshot);
    
        const items = [];
    
        for (const doc of querySnapshot.docs) {
          console.log('Processing document:', doc.id);
          const transactionData = doc.data();
          console.log('Transaction data:', transactionData);
          
          for (const item of transactionData.items) {
            console.log('Processing item:', item);
            const existingItem = items.find(i => i.upc === item.upc);
            if (!existingItem) {
              items.push({
                upc: item.upc,
                quantity: item.qty // Assuming quantity is stored in 'qty' field
              });
            } else {
              // If the item already exists, update the quantity
              existingItem.quantity += item.qty;
            }
          }
        }
    
        console.log('Cart items:', items);
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    
    fetchCartItems();
  }, [cartItemId, user]); // Include user in the dependency array

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>購物車詳情</h2>
      <p style={cartIdStyle}><strong>購物車ID:</strong> {cartItemId}</p>
      <div style={itemsContainerStyle}>
        {cartItems.map((item, index) => (
          <CartItemDetail key={index} upc={item.upc} quantity={item.quantity} />
        ))}
      </div>
    </div>
  );
}

function CartItemDetail({ upc, quantity }) {
  return (
    <div style={{ ...detailStyle, borderBottom: '1px solid #ccc' }}>
      <p><strong>商品ID:</strong> {upc}</p>
      <p><strong>數量:</strong> {quantity}</p>
    </div>
  );
}

// Styles and export omitted for brevity

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const titleStyle = {
  margin: '30px 0',
};

const cartIdStyle = {
  fontSize: '14px',
  color: '#666',
  fontWeight: 'bold',
};

const itemsContainerStyle = {
  maxWidth: '400px',
  margin: '0 auto',
  textAlign: 'left',
  paddingLeft: '20px',
};

const detailStyle = {
  marginBottom: '10px',
};

export default CartDetailView;
