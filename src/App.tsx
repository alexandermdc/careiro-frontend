import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import FormCliente from './pages/cadastro/cadastro';
import Login from './pages/login/login';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<FormCliente />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
export default App;
