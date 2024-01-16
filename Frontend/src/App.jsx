import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/all.css';

import { PizzaProvider } from './context/PizzaContext';
import PizzaPage from './pages/PizzaPage';
import HomePage from './pages/HomePage';
import PizzaFormPage from './pages/PizzaFormPage';
import IngredientPage from './pages/IngredientPage';
import NavBar from './components/Navbar';
import IngredientFormPage from './pages/IngredientFormPage';

function App() {
  return (
    <PizzaProvider>
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/' element={<HomePage />} />

          <Route path="/pizza" element={<PizzaPage />} />
          <Route path="/pizza-add" element={<PizzaFormPage />} />
          <Route path="/pizza-add/:id" element={<PizzaFormPage />} />

          <Route path='/ingredient' element={<IngredientPage/>}/>
          <Route path='/ingredient-add' element={<IngredientFormPage/>}/>
          <Route path='/ingredient-add/:id' element={<IngredientFormPage/>}/>
        </Routes>
      </Router>
    </PizzaProvider>
  );
}

export default App;
