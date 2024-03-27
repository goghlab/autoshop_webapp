import React, { useEffect, useState, useContext } from 'react';
import { getFirestore, collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Assuming you have AuthContext that provides user ID

function CartDetailView() {
  const { cartItemId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);
  const [total, setTotal] = useState(0); // State to hold the total

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
                quantity: item.qty, // Assuming quantity is stored in 'qty' field
                subtotal: 0 // Initialize subtotal with 0
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

  useEffect(() => {
    if (cartItems.length > 0) {
      cartItems.forEach(async (item) => {
        try {
          const db = getFirestore();
          const itemDoc = await getDoc(doc(db, '852items', item.upc));
          if (itemDoc.exists()) {
            const itemData = itemDoc.data();
            const price = itemData.price; // Assuming price is stored in 'price' field
            const subtotal = (item.quantity * price).toFixed(2); // Calculate subtotal
            console.log(`Subtotal for UPC ${item.upc}: ${subtotal}`); // Log subtotal
            item.subtotal = parseFloat(subtotal); // Update subtotal in cartItems state
            setCartItems([...cartItems]); // Update cartItems state
          } else {
            console.error('Item not found for UPC:', item.upc);
          }
        } catch (error) {
          console.error('Error fetching price for UPC:', item.upc, error);
        }
      });
    }
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length > 0) {
      const totalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0); // Sum up all subtotals
      setTotal(totalAmount.toFixed(2)); // Set total to 2 decimal places
    }
  }, [cartItems]);

  const handlePayNow = () => {
    // Add logic to handle payment
    console.log('Payment processing...');
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>購物車詳情</h2>
      <p style={cartIdStyle}><strong>購物車ID:</strong> {cartItemId}</p>
      <div style={itemsContainerStyle}>
        {cartItems.map((item, index) => (
          <CartItemDetail key={index} upc={item.upc} quantity={item.quantity} subtotal={item.subtotal} />
        ))}
      </div>
      <p style={{ ...detailStyle, marginTop: '20px' }}>總金額: {total !== null ? `HKD$ ${total}` : 'Calculating...'}</p>
      <button style={payNowButtonStyle} onClick={handlePayNow}>立即支付</button> {/* "立即支付" is "Pay Now" in traditional Chinese */}
    </div>
  );
}

function CartItemDetail({ upc, quantity, subtotal }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const db = getFirestore();
        const itemDoc = await getDoc(doc(db, '852items', upc));
        if (itemDoc.exists()) {
          const itemData = itemDoc.data();
          setPrice(itemData.price); // Assuming price is stored in 'price' field
        } else {
          console.error('Item not found for UPC:', upc);
        }
      } catch (error) {
        console.error('Error fetching price for UPC:', upc, error);
      }
    };
    fetchPrice();
  }, [upc]);

  return (
    <div style={{ ...detailStyle, borderBottom: '1px solid #ccc' }}>
      <p><strong>商品ID:</strong> {upc}</p>
      <p><strong>數量:</strong> {quantity}</p>
      <p><strong>售價:</strong> {price !== null ? price.toFixed(2) : 'Loading...'}</p> {/* Set price to 2 decimal places */}
      <p><strong>小計:</strong> {subtotal !== null ? subtotal : 'Calculating...'}</p>
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
  backgroundColor: '#007AFF', // Change button color to #007AFF
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  marginTop: '20px',
};

export default CartDetailView;
