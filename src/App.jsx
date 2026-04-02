import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './views/home/home';
import About from './views/about/about';
import Feature from './views/feature/feature';

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/feature" element={<Feature/>} />
    </Routes>
  </BrowserRouter>
  );
}


export default App
