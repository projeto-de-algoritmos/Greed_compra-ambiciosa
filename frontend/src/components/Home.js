import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [phase] = useState(1);
  const [products, setProducts] = useState([]);
  const [chosenProducts, setChosenProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });

    axios.get(`http://127.0.0.1:5000/phase/${phase}`)
      .then(response => {
        const { time, speed } = response.data;
        setTimeLeft(time);
        setSpeed(speed);
      })
      .catch(error => {
        console.error("There was an error fetching the phase!", error);
      });
  }, [phase]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      alert("Time's up!");
    }
  }, [timeLeft]);

  const handleProductClick = (product) => {
    if (total + product.price <= 50) { // Replace 50 with the current budget for the phase
      setChosenProducts([...chosenProducts, product]);
      setTotal(total + product.price);
    } else {
      alert("You can't exceed the budget!");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Supermarket Game - Phase {phase}</h1>
        <p>Time left: {timeLeft}s</p>
        <p>Total: ${total}</p>
        <div className="game-area">
          {products.map(product => (
            <img
              key={product.id}
              src={`http://127.0.0.1:5000/${product.image}`}
              alt={product.name}
              style={{ animation: `move ${speed}s linear infinite` }}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
        <div className="chosen-products">
          <h2>Chosen Products</h2>
          <ul>
            {chosenProducts.map((product, index) => (
              <li key={index}>
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Home;
