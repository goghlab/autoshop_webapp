import React, { useEffect, useState, useContext } from 'react';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function CartDetailView() {
  const { cartItemId } = useParams();
  const { user } = useContext(AuthContext);
  const [checkoutURL, setCheckoutURL] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          throw new Error('User not available');
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError(error.message || 'An error occurred');
        setLoading(false);
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
 
  const handlePayNow = async () => {
    try {
      // Obtain user's ID token from Firebase Authentication
      const idToken = await user.getIdToken();
      
      // Set headers including Authorization and Referer
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
        'Referer': 'https://payment.everything-intelligence.com',
      };
  
      // Prepare request body
      const requestBody = {
        cartId: cartItemId,
        totalAmount: total,
      };
  
      // Send request to initiate payment
      const response = await fetch('https://payment.everything-intelligence.com/initiate-payment', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });
  
      // Handle response
      if (!response.ok) {
        throw new Error(`Failed to initiate payment: ${response.statusText}`);
      }
  
      // Parse response data
      const responseData = await response.json();
      console.log('Response Data:', responseData);
  
      // Ensure responseData is valid and contains checkout_url
      if (responseData && responseData.checkout_url) {
        // Construct the checkout URL with the Referer header as a URL parameter
        const checkoutURLWithReferer = `${responseData.checkout_url}?referer=${encodeURIComponent(headers.Referer)}`;
        
        // Open the checkout URL in a new tab
        window.open(checkoutURLWithReferer, '_blank', `noopener,noreferrer`);
        console.log('Payment initiation successful.');
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError(error.message || 'An error occurred');
    }
  };
    

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>購物車詳情</h2>
      <p style={cartIdStyle}><strong>購物車ID:</strong> {cartItemId}</p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div style={itemsContainerStyle}>
            {cartItems.map((item, index) => (
              <CartItemDetail key={index} item={item} />
            ))}
          </div>
          <p style={{ ...detailStyle, marginTop: '20px' }}>總金額: {total !== null ? `HKD$ ${total}` : 'Calculating...'}</p>
          {checkoutURL && <iframe src={checkoutURL} style={iframeStyle}></iframe>}
          <button style={payNowButtonStyle} onClick={handlePayNow}>立即支付</button>
          <br></br>
          <br></br>
        </>
      )}
    </div>
  );
}

function CartItemDetail({ item }) {
  const [price, setPrice] = useState(null);
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const db = getFirestore();
        const itemDoc = await getDoc(doc(db, '852items', item.upc));
        if (itemDoc.exists()) {
          const itemData = itemDoc.data();
          const price = parseFloat(itemData.price); // Convert price string to number
          setPrice(price);
          setProductName(itemData.product);
        } else {
          console.error('Item not found for UPC:', item.upc);
        }
      } catch (error) {
        console.error('Error fetching item details for UPC:', item.upc, error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [item]);

  const quantityAsNumber = parseInt(item.quantity);
  const itemSubtotal = parseFloat(item.subtotal);

  return (
    <div style={{ ...detailStyle, borderBottom: '1px solid #ccc' }}>
      <p><strong>商品ID:</strong> {item.upc}</p>
      <p><strong>商品名稱:</strong> {loading ? 'Loading...' : productName}</p>
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

const iframeStyle = {
  width: '100%',
  height: '500px', // Adjust height as needed
  border: 'none',
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
