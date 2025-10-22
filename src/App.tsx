import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Homepage } from './pages/homepage/home';
import { SobreNos } from './pages/sobrenos/sobreNos';
import { Associacao } from './pages/associacao/Associacao';
import CadastroAssociacao from './pages/associacao/CadastroAssociacao';
import { Associacoes } from './pages/associacoes/Associacoes';
import { Produtores } from './pages/produtores/Produtores';
import { Feiras } from './pages/feiras/feiras';
import { Produtos } from './pages/produtos/Produtos';
import CadastroProduto from './pages/produtos/CadastroProduto';
import CadastroVendedor from './pages/vendedor/CadastroVendedor';
import FormCliente from './pages/cadastro/cadastro';
import Login from './pages/login/login';
import LoginVendedor from './pages/login/LoginVendedor';
import LoginTeste from './pages/login/LoginTeste';
import Dashboard from './pages/dashboard/Dashboard';
import PerfilCliente from './pages/perfil/PerfilCliente';
import CarrinhoPage from './pages/carrinho/CarrinhoPage';
import PagamentoRetorno from './pages/pagamento/PagamentoRetorno';
import CheckoutReal from './pages/checkout/CheckoutReal';
import CheckoutPedido from './pages/checkout/CheckoutPedido';
import PagamentoSucessoReal from './pages/pagamento/PagamentoSucessoReal';
import PagamentoFalhaReal from './pages/pagamento/PagamentoFalhaReal';
import MeusPedidos from './pages/pedidos/MeusPedidos';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Homepage />} />
        <Route path="/sobrenos" element={<SobreNos />} />
        <Route path="/cadastro" element={<FormCliente />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/vendedor" element={<LoginVendedor />} />
        <Route path="/login-teste" element={<LoginTeste />} />
        <Route path="/associacao" element={<Associacao />} />
        <Route path="/associacoes" element={<Associacoes />} />
        <Route path="/produtores" element={<Produtores />} />
        <Route path="/feiras" element={<Feiras />} />
        <Route path="/produtos" element={<Produtos />} />
        
        {/* Rotas de Carrinho */}
        <Route path="/carrinho" element={<CarrinhoPage />} />
        <Route path="/pagamento/retorno" element={<PagamentoRetorno />} />
        
        {/* Rotas de Pagamento Real - Mercado Pago */}
        <Route path="/checkout" element={<CheckoutReal />} />
        <Route path="/pagamento/sucesso" element={<PagamentoSucessoReal />} />
        <Route path="/pagamento/falha" element={<PagamentoFalhaReal />} />
        
        {/* Rotas de Pedidos */}
        <Route path="/checkout-pedido" element={<CheckoutPedido />} />
        <Route path="/pedidos" element={<MeusPedidos />} />
        
        {/* Rotas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/associacao/cadastro" 
          element={
            <ProtectedRoute>
              <CadastroAssociacao />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <PerfilCliente />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/produtos/cadastro" 
          element={
            <ProtectedRoute>
              <CadastroProduto />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vendedor/cadastro" 
          element={
            <ProtectedRoute>
              <CadastroVendedor />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
