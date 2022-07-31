import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/home/Home';
import Buildings from './pages/buildings/Buildings';
import Layout from './components/shared/Layout';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path='/' element={<Home />}/>
          <Route path='/buildings' element={<Buildings />}/>
        </Route>
      </Routes>
    </Router>
  </div>
  );
}

export default App;
