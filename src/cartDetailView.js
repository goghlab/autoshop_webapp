import React, { useEffect, useState, useContext } from 'react';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function CartDetailView() {
  const { cartItemId } = useParams();
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!user) {
          console.log('User not available, exiting...');
          return;
        }

        const db = getFirestore();
        const userRef = doc(db, 'Users', user.uid);
        const cartTransactionsQuery = query(collection(userRef, 'cartTransactions'));
        const querySnapshot = await getDocs(cartTransactionsQuery);

        const items = [];

        for (const doc of querySnapshot.docs) {
          const transactionData = doc.data();
          for (const item of transactionData.items) {
            const existingItem = items.find(i => i.upc === item.upc);
            if (!existingItem) {
              items.push({
                upc: item.upc,
                quantity: item.qty,
                subtotal: 0
              });
            } else {
              existingItem.quantity += item.qty;
            }
          }
        }

        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [cartItemId, user]);

  useEffect(() => {
    const calculateSubtotals = async () => {
      try {
        const updatedCartItems = [];

        for (const item of cartItems) {
          const db = getFirestore();
          const itemDoc = await getDoc(doc(db, '852items', item.upc));
          if (itemDoc.exists()) {
            const itemData = itemDoc.data();
            const price = itemData.price;
            const subtotal = (item.quantity * price).toFixed(2);
            updatedCartItems.push({ ...item, subtotal: parseFloat(subtotal) });
          } else {
            console.error('Item not found for UPC:', item.upc);
          }
        }

        setCartItems(updatedCartItems);
      } catch (error) {
        console.error('Error calculating subtotals:', error);
      }
    };

    if (cartItems.length > 0) {
      calculateSubtotals();
    }
  }, [cartItems]);

  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
      setTotal(totalAmount.toFixed(2));
    };

    if (cartItems.length > 0) {
      calculateTotal();
    }
  }, [cartItems]);

  const handlePayNow = () => {
    console.log('Payment processing...');
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>購物車詳情</h2>
      <p style={cartIdStyle}><strong>購物車ID:</strong> {cartItemId}</p>
      <div style={itemsContainerStyle}>
        {cartItems.map((item, index) => (
          <CartItemDetail key={index} item={item} />
        ))}
      </div>
      <p style={{ ...detailStyle, marginTop: '20px' }}>總金額: {total !== null ? `HKD$ ${total}` : 'Calculating...'}</p>
      <button style={payNowButtonStyle} onClick={handlePayNow}>立即支付</button>
    </div>
  );
}

function CartItemDetail({ item }) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const db = getFirestore();
        const itemDoc = await getDoc(doc(db, '852items', item.upc));
        if (itemDoc.exists()) {
          const itemData = itemDoc.data();
          const price = parseFloat(itemData.price); // Convert price string to number
          setPrice(price);
        } else {
          console.error('Item not found for UPC:', item.upc);
        }
      } catch (error) {
        console.error('Error fetching price for UPC:', item.upc, error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchPrice();
  }, [item]);

  const quantityAsNumber = parseInt(item.quantity);
  const itemSubtotal = parseFloat(item.subtotal);

  return (
    <div style={{ ...detailStyle, borderBottom: '1px solid #ccc' }}>
      <p><strong>商品ID:</strong> {item.upc}</p>
      <p><strong>數量:</strong> {quantityAsNumber}</p>
      {loading ? (
        <p><strong>售價:</strong> Loading...</p>
      ) : (
        <p><strong>售價:</strong> {typeof price === 'number' ? price.toFixed(2) : 'N/A'}</p>
      )}
      <p><strong>小計:</strong> {typeof itemSubtotal === 'number' && !isNaN(itemSubtotal) ? itemSubtotal.toFixed(2) : 'Calculating...'}</p>
    </div>
  );
}

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

const payNowButtonStyle = {
  backgroundColor: '#007AFF',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  marginTop: '20px',
};

export default CartDetailView;
