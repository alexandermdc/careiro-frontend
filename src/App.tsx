import { Routes, Route } from 'react-router-dom';
import { Homepage } from './pages/homepage/home';
import { SobreNos } from './pages/sobrenos/sobreNos';
import { Associacao } from './pages/associacao/Associacao';
import { Associacoes } from './pages/associacoes/Associacoes';
import { Produtores } from './pages/produtores/Produtores';
import { Feiras } from './pages/feiras/feiras';
import { Produtos } from './pages/produtos/Produtos';
import FormCliente from './pages/cadastro/cadastro';
import Login from './pages/login/login';

  

function App() {
  return (
    <Routes>
      <Route path="/sobrenos" element={<SobreNos />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/cadastro" element={<FormCliente />} />
      <Route path="/login" element={<Login />} />
      <Route path="/associacao" element={<Associacao />} />
      <Route path="/associacoes" element={<Associacoes />} />
      <Route path="/produtores" element={<Produtores />} />
      <Route path="/feiras" element={<Feiras />} />
      <Route path="/produtos" element={<Produtos />} />
    </Routes>
  );
}
export default App;
