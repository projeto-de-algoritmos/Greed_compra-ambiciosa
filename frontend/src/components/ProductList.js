import React from 'react';

const ProductList = ({ products, title, totalSpent }) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <img src={`http://127.0.0.1:5000/${product.image}`} alt={product.name} width="100" />
            <p>{product.name} - R${product.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
      {totalSpent !== undefined && (
        <p>Total Spent: R${totalSpent.toFixed(2)}</p>
      )}
    </div>
  );
};

export default ProductList;