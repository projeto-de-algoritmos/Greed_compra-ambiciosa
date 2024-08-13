import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Fase1.css'; 

const FaseManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [movementInterval, setMovementInterval] = useState(1000); 
  const [startTime, setStartTime] = useState(null); 
  const [timeElapsed, setTimeElapsed] = useState(0); 
  const [isTiming, setIsTiming] = useState(true); 
  const [currentPhase, setCurrentPhase] = useState(1);
  const [phaseData, setPhaseData] = useState(null);
  const [coins, setCoins] = useState([]);
  const [showPayment, setShowPayment] = useState(false); 
  const [userCoins, setUserCoins] = useState([]); 
  const [paymentComplete, setPaymentComplete] = useState(false); 
  const [greedyData, setGreedyData] = useState(null); 

  
  useEffect(() => {
    fetchPhaseData(currentPhase);
    fetchCoins(); 
  }, [currentPhase]);

  
  const fetchProducts = async (numprod) => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      const allProducts = response.data;
      const selectedProducts = allProducts.slice(0, numprod).map(product => ({
        ...product,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`
      }));
      setProducts(selectedProducts);
    } catch (error) {
      console.error("There was an error fetching the products!", error);
    }
  };

  
  const fetchPhaseData = async (phaseId) => {
    try {
      const response = await axios.get(`http://localhost:5000/phase/${phaseId}`);
      const phase = response.data;
      setPhaseData(phase);
      setStartTime(Date.now());
      setTotal(0);
      setSelectedProducts([]);
      setIsTiming(true);
      setShowPayment(false); 
      setUserCoins([]); 
      setPaymentComplete(false); 
      fetchProducts(phase.numprod); 
    } catch (error) {
      console.error("There was an error fetching the phase data!", error);
    }
  };

  
  const fetchCoins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/coins');
      setCoins(response.data);
    } catch (error) {
      console.error("There was an error fetching the coins!", error);
    }
  };

  const fetchGreedyData = async () => {
    try {
      const response = await axios.post('http://localhost:5000/greedy', {
        budget: phaseData.budget, // Envia o objetivo da fase
        products: products // Envia todos os produtos disponíveis na fase
      });
      setGreedyData(response.data);
    } catch (error) {
      console.error("There was an error fetching the greedy data!", error);
    }
  };
  

  useEffect(() => {
    if (startTime && isTiming) {
      const timer = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        setTimeElapsed(elapsed);
        if (elapsed >= (phaseData?.time || 0)) { 
          setIsTiming(false);
          setShowPayment(true); 
          fetchGreedyData();
        }
      }, 100); 
  
      return () => clearInterval(timer);
    }
  }, [startTime, isTiming, phaseData]);
  

  useEffect(() => {
    if (showPayment) return; 
  
    const interval = setInterval(() => {
      setProducts(prevProducts => prevProducts.map(product => ({
        ...product,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`
      })));
    }, movementInterval);
  
    return () => clearInterval(interval);
  }, [movementInterval, showPayment]);
  

  const handleClick = (product) => {
    if (showPayment) return; 
  
    const newTotal = total + product.price;
  
    if (newTotal <= phaseData?.budget) { 
      const existingProduct = selectedProducts.find(p => p.id === product.id);
  
      if (existingProduct) {
        existingProduct.quantity += 1;
        setSelectedProducts([...selectedProducts]);
      } else {
        setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
      }
  
      setTotal(newTotal);
  
      if (newTotal >= phaseData?.budget) { // Verifique se o total é maior ou igual à meta
        setIsTiming(false);
        setShowPayment(true);
        fetchGreedyData();
      }
    } else {
      setIsTiming(false);
      setShowPayment(true); 
      fetchGreedyData(); 
      alert('Você não pode adicionar mais produtos, o valor meta será excedido!');
    }
  };
  
  
  
  
  useEffect(() => {
    if (showPayment) {
      fetchGreedyData();
    }
  }, [showPayment]);
  

  
  const handlePaymentClick = (coin) => {
    const newTotalCoinsValue = userCoins.reduce((acc, coin) => acc + coin.price, 0) + coin.price;
    
    if (newTotalCoinsValue <= total) {
      setUserCoins(prevCoins => [...prevCoins, coin]);
    } else {
      alert('O valor total das moedas selecionadas excede o valor a pagar!');
    }
  }
  

  const handleConfirmPayment = async () => {
    // Verificar se nenhum produto foi selecionado
    if (selectedProducts.length === 0) {
      alert('Você não selecionou nenhum produto. A fase será reiniciada.');
      // Reinicie a fase
      fetchPhaseData(currentPhase); 
      return;
    }
  
    const totalCoinsValue = userCoins.reduce((acc, coin) => acc + coin.price, 0);
  
    if (totalCoinsValue < total) {
      alert('Você não selecionou moedas suficientes para pagar!');
      setUserCoins([]);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/troco', {
        amount: total, 
        user_solution: userCoins.map(coin => coin.price * 100) 
      });
      const { is_optimal } = response.data;
      if (is_optimal) {
        const playerSolution = {
          total: total, 
          quantity: selectedProducts.reduce((acc, p) => acc + p.quantity, 0)
        };
  
        const comparisonResponse = await axios.post('http://localhost:5000/compare', {
          greedy: greedyData,
          player: playerSolution
        });
  
        const { percentage_difference } = comparisonResponse.data;
        alert(`A diferença percentual entre a solução do jogador e a solução do algoritmo greedy é ${percentage_difference.toFixed(2)}%`);
  
        setPaymentComplete(true);
        setTimeout(() => {
          setCurrentPhase(prevPhase => prevPhase + 1);
          setStartTime(null);
          setTimeElapsed(0);
          setShowPayment(false);
          setUserCoins([]); 
        }, 1000); 
      } else {
        alert('Troco não é ótimo, tente novamente.');
        setUserCoins([]); 
      }
    } catch (error) {
      console.error("There was an error confirming the payment!", error);
    }
  };  
  
  const totalCoinsValue = userCoins.reduce((acc, coin) => acc + coin.price, 0);

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
            disabled={showPayment}
          />
        </div>
        <h2>Produtos Selecionados</h2>
        <ul>
        {selectedProducts.map((product, index) => (
          <li key={index}>
            <img src={`http://localhost:5000/static/${product.image}`} alt={product.name} width="50" />
            <p>{product.name} - R${(product.price || 0).toFixed(2)} - Quantidade: {product.quantity || 1}</p>
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
      {showPayment && (
  <div className="payment-container">
    <h2>Pagamento</h2>
    {greedyData && (
      <div className="greedy-info">
        <h3>Melhor solução:</h3>
        <ul>
          {greedyData.chosen_products.map((product, index) => (
            <li key={index}>
              <img src={`http://localhost:5000/static/${product.image}`} alt={product.name} width="50" />
              <p>{product.name} - R${(product.price || 0).toFixed(2)} - Quantidade: {product.quantity || 1}</p>
            </li>
          ))}
        </ul>
        <p>Total: R${(greedyData.preco_total || 0).toFixed(2)}</p>
      </div>
    )}
    <div className="player-result">
      <h3>Sua solução:</h3>
      <ul>
        {selectedProducts.map((product, index) => (
          <li key={index}>
            <img src={`http://localhost:5000/static/${product.image}`} alt={product.name} width="50" />
            <p>{product.name} - R${(product.price || 0).toFixed(2)} - Quantidade: {product.quantity || 1}</p>
          </li>
        ))}
      </ul>
       <p>Total: R${total.toFixed(2)}</p>
    </div>
    <p>Total Moedas Selecionadas: R${(totalCoinsValue).toFixed(2)}</p>
    <div className="coins">
      {coins.map((coin) => (
        <img
          key={coin.id}
          src={`http://localhost:5000/static/${coin.image}`}
          alt={coin.name}
          width="50"
          onClick={() => handlePaymentClick(coin)}
          style={{ cursor: 'pointer' }}
        />
      ))}
    </div>
    <button onClick={handleConfirmPayment} disabled={paymentComplete}>Confirmar Pagamento</button>
  </div>
)}
    </div>
  );
};

export default FaseManager;
