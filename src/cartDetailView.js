import React from 'react';
import { useParams } from 'react-router-dom';

function CartDetailView() {
  const { cartItemId } = useParams();

  // Fetch cart item details using cartItemId, you can implement this logic

  return (
    <div style={containerStyle}>
      <h2>購物車詳情</h2>
      <p>購物車ID: {cartItemId}</p>
      {/* Render other details of the cart item */}
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh', // Adjust as needed
};

export default CartDetailView;
