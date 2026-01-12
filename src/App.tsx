import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritosProvider } from './contexts/FavoritosContext';
import { BuscaProvider } from './contexts/BuscaContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Homepage } from './pages/homepage/home';
import { SobreNos } from './pages/sobrenos/sobreNos';
import { Associacao } from './pages/associacao/Associacao';
import CadastroAssociacao from './pages/associacao/CadastroAssociacao';
import { Associacoes } from './pages/associacoes/Associacoes';
import { Produtores } from './pages/produtores/Produtores';
import { Feiras } from './pages/feiras/feiras';
import CadastrarFeira from './pages/feiras/CadastrarFeira';
import { Produtos } from './pages/produtos/Produtos';
import CadastroProduto from './pages/produtos/CadastroProduto';
import GerenciarProdutos from './pages/produtos/GerenciarProdutos';
import CadastroVendedor from './pages/vendedor/CadastroVendedor';
import FormCliente from './pages/cadastro/cadastro';
import Login from './pages/login/login';
import LoginVendedor from './pages/login/LoginVendedor';
import Dashboard from './pages/dashboard/Dashboard';
import Perfil from './pages/perfil/Perfil';
import CarrinhoPage from './pages/carrinho/CarrinhoPage';
import PagamentoRetorno from './pages/pagamento/PagamentoRetorno';
import CheckoutPedido from './pages/checkout/CheckoutPedido';
import PagamentoSucessoReal from './pages/pagamento/PagamentoSucessoReal';
import PagamentoFalhaReal from './pages/pagamento/PagamentoFalhaReal';
import PagamentoPendenteReal from './pages/pagamento/PagamentoPendenteReal';
import MeusPedidos from './pages/pedidos/MeusPedidos';
import Favoritos from './pages/favoritos/Favoritos';
import BuscaResultados from './pages/busca/BuscaResultados';
import PainelAdmin from './pages/admin/PainelAdmin';
import GerenciarAssociacoes from './pages/admin/GerenciarAssociacoes';
import GerenciarFeiras from './pages/admin/GerenciarFeiras';
import GerenciarVendedores from './pages/admin/GerenciarVendedores';


function App() {
  return (
    <AuthProvider>
      <FavoritosProvider>
        <BuscaProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Homepage />} />
        <Route path="/sobrenos" element={<SobreNos />} />
        <Route path="/cadastro" element={<FormCliente />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/vendedor" element={<LoginVendedor />} />
        <Route path="/associacao" element={<Associacao />} />
        <Route path="/associacoes" element={<Associacoes />} />
        <Route path="/produtores" element={<Produtores />} />
        <Route path="/feiras" element={<Feiras />} />
        <Route path="/produtos" element={<Produtos />} />
        
        {/* Rotas de Carrinho */}
        <Route path="/carrinho" element={<CarrinhoPage />} />
        <Route path="/pagamento/retorno" element={<PagamentoRetorno />} />
        
        {/* Rotas de Pagamento Real - Mercado Pago */}
        <Route path="/pagamento/sucesso" element={<PagamentoSucessoReal />} />
        <Route path="/pagamento/falha" element={<PagamentoFalhaReal />} />
        <Route path="/pagamento/pendente" element={<PagamentoPendenteReal />} />
        
        {/* Rotas de Pedidos */}
        <Route path="/checkout-pedido" element={<CheckoutPedido />} />
        <Route path="/pedidos" element={<MeusPedidos />} />
        
        {/* Rotas de Favoritos */}
        <Route path="/favoritos" element={<Favoritos />} />
        
        {/* Rotas de Busca */}
        <Route path="/busca" element={<BuscaResultados />} />
        
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
          path="/admin" 
          element={
            <ProtectedRoute>
              <PainelAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/associacoes" 
          element={
            <ProtectedRoute requireRole="ADMIN">
              <GerenciarAssociacoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/feiras" 
          element={
            <ProtectedRoute requireRole="ADMIN">
              <GerenciarFeiras />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/vendedores" 
          element={
            <ProtectedRoute requireRole="ADMIN">
              <GerenciarVendedores />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/associacao/cadastro" 
          element={
            <ProtectedRoute requireRole="ADMIN">
              <CadastroAssociacao />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feiras/cadastro" 
          element={
            <ProtectedRoute>
              <CadastrarFeira />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <Perfil />
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
          path="/produtos/gerenciar" 
          element={
            <ProtectedRoute>
              <GerenciarProdutos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vendedor/cadastro" 
          element={<CadastroVendedor />} 
        />
        
        {/* Rota 404 - Fallback */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Página não encontrada</h2>
                <p className="text-gray-600 mb-6">
                  A página que você está procurando não existe.
                </p>
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Voltar ao Início
                </Link>
              </div>
            </div>
          } 
        />
      </Routes>
        </BuscaProvider>
      </FavoritosProvider>
    </AuthProvider>
  );
}

export default App;
