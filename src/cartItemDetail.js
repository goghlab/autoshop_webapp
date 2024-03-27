import React from 'react';

function CartItemDetail({ itemDetail }) {
  return (
    <div>
      <p>商品ID: {itemDetail.upc}</p>
      <p>數量: {itemDetail.quantity}</p>
      <p>售價: {itemDetail.price.toFixed(2)}</p>
      <p>小計: {(itemDetail.subtotal).toFixed(2)}</p>
      <hr />
    </div>
  );
}

export default CartItemDetail;
