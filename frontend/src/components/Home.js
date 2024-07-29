import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [budget, setBudget] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handlePurchase = () => {
    axios.post('http://127.0.0.1:5000/purchase', { budget: parseFloat(budget) })
      .then(response => {
        setPurchasedItems(response.data.purchased_items);
        setTotalSpent(response.data.total_spent);
      })
      .catch(error => {
        console.error("There was an error making the purchase!", error);
      });
  };

  return (
    <div>
      <h1>Shopping List</h1>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="Enter your budget"
      />
      <button onClick={handlePurchase}>Purchase</button>
      <ProductList products={products} title="Available Products" />
      <ProductList products={purchasedItems} title="Purchased Items" totalSpent={totalSpent} />
    </div>
  );
};

export default Home;
