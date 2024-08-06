import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fase1.css'; // Importar o CSS para o componente

const Fase1 = ({ goal, timeLimit, onComplete }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [movementInterval, setMovementInterval] = useState(1000); // Velocidade do movimento em milissegundos
  const [startTime, setStartTime] = useState(null); // Tempo de início da fase
  const [timeElapsed, setTimeElapsed] = useState(0); // Tempo decorrido
  const [isTiming, setIsTiming] = useState(true); // Controle de se o cronômetro está ativo

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
    setStartTime(Date.now());

    const interval = setInterval(() => {
      setProducts(prevProducts => prevProducts.map(product => ({
        ...product,
        top: Math.random() * 90 + '%',
        left: Math.random() * 90 + '%'
      })));
    }, movementInterval);

    return () => clearInterval(interval);
  }, [movementInterval]);

  useEffect(() => {
    if (startTime && isTiming) {
      const timer = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        setTimeElapsed(elapsed);
        if (elapsed >= timeLimit) {
          setIsTiming(false);
          alert('Tempo esgotado!');
          onComplete(total, elapsed, selectedProducts);
        }
      }, 100); // Atualiza a cada 100 ms

      return () => clearInterval(timer);
    }
  }, [startTime, timeElapsed, isTiming, timeLimit, total, selectedProducts, onComplete]);

  const handleClick = (product) => {
    if (total >= goal) {
      alert('Meta atingida!');
      return;
    }

    const newTotal = total + product.price;

    if (newTotal <= goal) {
      setSelectedProducts([...selectedProducts, product]);
      setTotal(newTotal);

      if (newTotal === goal) {
        setIsTiming(false);
        onComplete(newTotal, timeElapsed, [...selectedProducts, product]);
      }
    } else {
      setIsTiming(false);
      alert('Você não pode adicionar mais produtos, o valor meta será excedido!');
      onComplete(total, timeElapsed, selectedProducts);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h1>Fase {goal}</h1>
        <p className="time-elapsed">Tempo decorrido: {timeElapsed || '0.00'} segundos</p>
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
            <img
              src={`http://127.0.0.1:5000/${product.image}`}
              alt={product.name}
              width="100"  // Ajuste o valor conforme necessário
              height="100" // Ajuste o valor conforme necessário
            />
            <p>{product.name} - R${(product.price || 0).toFixed(2)}</p>
          </li>
        ))}
      </ul>
        <p className="total">Total: R${(total || 0).toFixed(2)}</p>
        <p className="goal">Goal: R${(goal || 0).toFixed(2)}</p>
      </div>
      <div className="image-area">
        {products.map(product => (
          <img
            key={product.id}
            src={`http://127.0.0.1:5000/${product.image}`}
            alt={product.name}
            width="1000"  // Ajuste o valor conforme necessário
            height="1000" // Ajuste o valor conforme necessário
            style={{
              position: 'absolute',
              top: product.top,
              left: product.left,
              transition: 'top 1s, left 1s',
              cursor: 'pointer',
              objectFit: 'cover'  // Ajusta a imagem para cobrir a área sem distorcer
            }}
            onClick={() => handleClick(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default Fase1;
