import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import TodoList from './component/TodoList';
import Login_Page from './component/Login';

function App() {
  return (
    <div className="min-h-screen bg-gray-800 text-gray-800">
      <Router>
        <Routes> 
          <Route path="/" element={<Login_Page />} />
          <Route path="/TodoList" element={<TodoList className="py-8" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
