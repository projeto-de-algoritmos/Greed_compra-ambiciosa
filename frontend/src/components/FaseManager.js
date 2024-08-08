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
  const [coins, setCoins] = useState([]);
  const [showPayment, setShowPayment] = useState(false); // Controle para exibir a sessão de pagamento
  const [userCoins, setUserCoins] = useState([]); // Moedas que o usuário clicou
  const [paymentComplete, setPaymentComplete] = useState(false); // Controle de pagamento

  useEffect(() => {
    fetchPhaseData(currentPhase);
    fetchCoins(); // Chama a função para buscar moedas
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
      setShowPayment(false); // Esconde o pagamento no início da fase
      setUserCoins([]); // Limpa as moedas clicadas
      setPaymentComplete(false); // Reseta o status de pagamento
      fetchProducts(phase.numprod); // Passa o número de produtos para a função fetchProducts
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

  useEffect(() => {
    if (startTime && isTiming) {
      const timer = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        setTimeElapsed(elapsed);
        if (elapsed >= phaseData.time) {
          setIsTiming(false);
          setShowPayment(true); // Mostra o container de pagamento ao final do tempo
        }
      }, 100); // Atualiza a cada 100 ms

      return () => clearInterval(timer);
    }
  }, [startTime, isTiming, phaseData]);

  useEffect(() => {
    if (showPayment) return; // Para o movimento dos produtos quando o pagamento começar

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
    if (showPayment) return; // Desativa a seleção de produtos quando o pagamento começar
  
    const newTotal = total + product.price;
  
    if (newTotal <= phaseData.budget) {
      setSelectedProducts([...selectedProducts, product]);
      setTotal(newTotal);
  
      if (newTotal === phaseData.budget) {
        setIsTiming(false);
        setShowPayment(true); // Mostra o container de pagamento ao atingir a meta
      }
    } else {
      // Se o valor total exceder o orçamento, finalize a seleção e abra o pagamento
      setIsTiming(false);
      setShowPayment(true); // Abre o container de pagamento imediatamente
      alert('Você não pode adicionar mais produtos, o valor meta será excedido!');
    }
  };
  

  const handlePaymentClick = (coin) => {
    const newTotalCoinsValue = userCoins.reduce((acc, coin) => acc + coin.price, 0) + coin.price;
  
    // Verifica se o valor total das moedas selecionadas não excede o valor total a ser pago
    if (newTotalCoinsValue <= total) {
      setUserCoins(prevCoins => [...prevCoins, coin]); // Adiciona a moeda completa
    } else {
      alert('O valor total das moedas selecionadas excede o valor a pagar!');
    }
  };
  

  const handleConfirmPayment = async () => {
    const totalCoinsValue = userCoins.reduce((acc, coin) => acc + coin.price, 0);
    
    if (totalCoinsValue < total) {
      alert('Você não selecionou moedas suficientes para pagar!');
      setUserCoins([]); // Reseta as moedas selecionadas
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/troco', {
        amount: total,
        user_solution: userCoins.map(coin => coin.price * 100) // Multiplica o valor das moedas por 100
      });
      const { is_optimal } = response.data;
      if (is_optimal) {
        setPaymentComplete(true);
        setTimeout(() => {
          setCurrentPhase(prevPhase => prevPhase + 1); // Avança para a próxima fase
          setStartTime(null);
          setTimeElapsed(0);
          setShowPayment(false);
          setUserCoins([]); // Limpa as moedas clicadas
        }, 1000); // Pequeno delay antes de avançar
      } else {
        alert('Pagamento não é ótimo, tente novamente.');
        setUserCoins([]); // Reseta as moedas selecionadas ao errar
      }
    } catch (error) {
      console.error("There was an error confirming the payment!", error);
    }
  };
   

  // Calcula o valor total das moedas selecionadas
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
            disabled={showPayment} // Desativa a mudança de intervalo durante o pagamento
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
      {showPayment && (
        <div className="payment-container">
          <h2>Pagamento</h2>
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
