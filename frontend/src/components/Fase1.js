import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fase1.css'; // Importar o CSS para o componente

const Fase1 = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [movementInterval, setMovementInterval] = useState(1000); // Velocidade do movimento em milissegundos

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
    }, movementInterval);

    return () => clearInterval(interval);
  }, [movementInterval]);

  const handleClick = (product) => {
    setSelectedProducts([...selectedProducts, product]);
    setTotal(total + product.price);
  };

  return (
    <div className="container">
      <div className="image-area">
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
      <div className="sidebar">
        <h1>Fase 1</h1>
        <div className="controls">
          <label htmlFor="interval">Movement Interval (ms): </label>
          <input
            id="interval"
            type="number"
            value={movementInterval}
            onChange={(e) => setMovementInterval(Number(e.target.value))}
            min="100"
          />
        </div>
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
