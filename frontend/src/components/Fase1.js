import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fase1.css'; // Importar o CSS para o componente

const Fase1 = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [movementInterval, setMovementInterval] = useState(1000); // Velocidade do movimento em milissegundos
  const [goal, setGoal] = useState(100); // Valor meta para a fase
  const [startTime, setStartTime] = useState(null); // Tempo de início da fase
  const [timeElapsed, setTimeElapsed] = useState(0); // Tempo decorrido
  const [timeTaken, setTimeTaken] = useState(null); // Tempo total para atingir a meta
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
    // Inicia o timer quando o componente é montado
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
        setTimeElapsed(((Date.now() - startTime) / 1000).toFixed(2)); // Tempo em segundos
      }, 100); // Atualiza a cada 100 ms

      return () => clearInterval(timer);
    }
  }, [startTime, isTiming]);

  const handleClick = (product) => {
    // Verifica se o total já atingiu a meta
    if (total >= goal) {
      alert('Meta atingida!');
      return;
    }

    // Atualiza a lista de produtos selecionados e o total
    const newTotal = total + product.price;

    if (newTotal <= goal) {
      setSelectedProducts([...selectedProducts, product]);
      setTotal(newTotal);

      // Verifica se o total atingiu a meta
      if (newTotal === goal) {
        setIsTiming(false); // Para o cronômetro
        setTimeTaken(timeElapsed); // Define o tempo total quando a meta é atingida
        alert(`Parabéns! Você atingiu a meta em ${timeElapsed} segundos.`);
      }
    } else {
      setIsTiming(false); // Para o cronômetro
      alert('Você não pode adicionar mais produtos, o valor meta será excedido!');
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h1>Fase 1</h1>
        {timeElapsed && (
          <p className="time-elapsed">Tempo decorrido: {timeElapsed} segundos</p>
        )}
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
        <p>Goal: R${goal.toFixed(2)}</p>
        {timeTaken && (
          <p>Tempo para atingir a meta: {timeTaken} segundos</p>
        )}
      </div>
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
    </div>
  );
};

export default Fase1;
