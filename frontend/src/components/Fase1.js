import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Fase1 = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/products')
      .then(response => {
        setProducts(response.data.map(product => ({
          ...product,
          top: Math.random() * 90 + '%',
          left: Math.random() * 90 + '%'
        })));
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prevProducts => prevProducts.map(product => ({
        ...product,
        top: Math.random() * 90 + '%',
        left: Math.random() * 90 + '%'
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (product) => {
    setSelectedProducts([...selectedProducts, product]);
    setTotal(total + product.price);
  };

  return (
    <div>
      <h1>Fase 1</h1>
      <div style={{ width: '500px', height: '500px', position: 'relative', border: '1px solid black', overflow: 'hidden' }}>
        {products.map(product => (
          <img
            key={product.id}
            src={`http://127.0.0.1:5000/${product.image}`}
            alt={product.name}
            width="50"
            style={{
              position: 'absolute',
              top: product.top,
              left: product.left,
              transition: 'top 1s, left 1s',
              cursor: 'pointer'
            }}
            onClick={() => handleClick(product)}
          />
        ))}
      </div>
      <div>
        <h2>Selected Products</h2>
        <ul>
          {selectedProducts.map((product, index) => (
            <li key={index}>
              <img src={`http://127.0.0.1:5000/${product.image}`} alt={product.name} width="50" />
              <p>{product.name} - R${product.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
        <p>Total: R${total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Fase1;
