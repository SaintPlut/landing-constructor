import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, TemplatesList, TemplateDetails } from './pages';
// import { Constructor } from './pages'; // Пока закомментируем
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TemplatesList />} />
          <Route path="/template/:id" element={<TemplateDetails />} />
          {/* <Route path="/constructor/:id" element={<Constructor />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;