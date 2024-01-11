import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/all.css';

import { PizzaProvider } from './context/PizzaContext';
import PizzaPage from './pages/PizzaPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <PizzaProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/pizza" element={<PizzaPage />} />
        </Routes>
      </Router>
    </PizzaProvider>
  );
}

export default App;
