import { Routes, Route } from 'react-router-dom';
import { Homepage } from './pages/homepage/home';
import { SobreNos } from './pages/sobrenos/sobreNos';
import FormCliente from './pages/cadastro/cadastro';
import Login from './pages/login/login';



function App() {
  return (
    <Routes>
      <Route path="/sobrenos" element={<SobreNos />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/cadastro" element={<FormCliente />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
export default App;
