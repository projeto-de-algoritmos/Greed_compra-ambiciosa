import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fase1.css'; // Certifique-se de que o CSS está configurado corretamente

const FaseManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [movementInterval, setMovementInterval] = useState(1000); // Velocidade do movimento em milissegundos
  const [startTime, setStartTime] = useState(null); // Tempo de início da fase
  const [timeElapsed, setTimeElapsed] = useState(0); // Tempo decorrido
  const [isTiming, setIsTiming] = useState(true); // Controle de se o cronômetro está ativo
  const [currentPhase, setCurrentPhase] = useState(1);
  const [phaseData, setPhaseData] = useState(null);

  useEffect(() => {
    fetchPhaseData(currentPhase);
    fetchProducts();
  }, [currentPhase]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data.map(product => ({
        ...product,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`
      })));
    } catch (error) {
      console.error("There was an error fetching the products!", error);
    }
  };

  const fetchPhaseData = async (phaseId) => {
    try {
      const response = await axios.get(`http://localhost:5000/phase/${phaseId}`);
      setPhaseData(response.data);
      setStartTime(Date.now());
      setTotal(0);
      setSelectedProducts([]);
      setIsTiming(true);
    } catch (error) {
      console.error("There was an error fetching the phase data!", error);
    }
  };

  useEffect(() => {
    if (startTime && isTiming) {
      const timer = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        setTimeElapsed(elapsed);
        if (elapsed >= phaseData.time) {
          setIsTiming(false);
          alert('Tempo esgotado!');
          handlePhaseComplete();
        }
      }, 100); // Atualiza a cada 100 ms

      return () => clearInterval(timer);
    }
  }, [startTime, isTiming, phaseData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prevProducts => prevProducts.map(product => ({
        ...product,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`
      })));
    }, movementInterval);

    return () => clearInterval(interval);
  }, [movementInterval]);

  const handleClick = (product) => {
    if (total >= phaseData.budget) {
      alert('Meta atingida!');
      return;
    }

    const newTotal = total + product.price;

    if (newTotal <= phaseData.budget) {
      setSelectedProducts([...selectedProducts, product]);
      setTotal(newTotal);

      if (newTotal === phaseData.budget) {
        setIsTiming(false);
        handlePhaseComplete();
      }
    } else {
      setIsTiming(false);
      alert('Você não pode adicionar mais produtos, o valor meta será excedido!');
      handlePhaseComplete();
    }
  };

  const handlePhaseComplete = () => {
    const phaseEndTime = Date.now();
    console.log(`Fase ${currentPhase} concluída em ${((phaseEndTime - startTime) / 1000).toFixed(2)} segundos`);
    // Lógica para passar para a próxima fase ou reiniciar
    setCurrentPhase(prevPhase => prevPhase + 1); // Próxima fase
    setStartTime(null);
    setTimeElapsed(0);
    setIsTiming(true);
  };

  if (!phaseData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container">
      <div className="sidebar">
        <h1>Fase {currentPhase}</h1>
        <p className="time-elapsed">Tempo decorrido: {timeElapsed || '0.00'} segundos</p>
        <div className="controls">
          <label htmlFor="interval">Intervalo de Movimento (ms): </label>
          <input
            id="interval"
            type="number"
            value={movementInterval}
            onChange={(e) => setMovementInterval(Number(e.target.value))}
            min="100"
          />
        </div>
        <h2>Produtos Selecionados</h2>
        <ul>
          {selectedProducts.map((product, index) => (
            <li key={index}>
              <img src={`http://localhost:5000/static/${product.image}`} alt={product.name} width="50" />
              <p>{product.name} - R${(product.price || 0).toFixed(2)}</p>
            </li>
          ))}
        </ul>
        <p className="total">Total: R${(total || 0).toFixed(2)}</p>
        <p className="goal">Meta: R${(phaseData.budget || 0).toFixed(2)}</p>
      </div>
      <div className="image-area">
        {products.map(product => (
          <img
            key={product.id}
            src={`http://localhost:5000/static/${product.image}`}
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

export default FaseManager;
