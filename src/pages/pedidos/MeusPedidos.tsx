import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pedidoService from '../../services/pedidoService';
import type { Pedido } from '../../services/pedidoService';

export default function MeusPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      const dados = await pedidoService.listarPedidos();
      setPedidos(dados);
      
      console.log('✅ Pedidos carregados:', dados.length);
    } catch (error: any) {
      console.error('❌ Erro ao buscar pedidos:', error);
      
      if (error.response?.status === 401) {
        setErro('Você precisa estar logado para ver seus pedidos.');
      } else {
        setErro('Erro ao carregar pedidos. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erro</h2>
          <p className="text-gray-600 mb-6">{erro}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Fazer Login
            </button>
            <button
              onClick={buscarPedidos}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Meus Pedidos</h1>
            <button
              onClick={() => navigate('/produtos')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Fazer Novo Pedido
            </button>
          </div>
        </div>

        {/* Lista de Pedidos */}
        {pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nenhum pedido encontrado</h2>
            <p className="text-gray-600 mb-6">Você ainda não fez nenhum pedido.</p>
            <button
              onClick={() => navigate('/produtos')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Ver Produtos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.pedido_id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Pedido #{pedido.pedido_id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatarData(pedido.data_pedido)}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Confirmado
                  </span>
                </div>

                {/* Informações da Feira */}
                {pedido.feira && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Feira:</strong> {pedido.feira.nome || pedido.fk_feira}
                    </p>
                  </div>
                )}

                {/* Itens do Pedido */}
                {pedido.atende_um && pedido.atende_um.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Itens do Pedido:</p>
                    <div className="space-y-2">
                      {pedido.atende_um.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.produto?.nome || `Produto ${item.fk_produto}`} x{item.quantidade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botão Ver Detalhes */}
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => navigate(`/pedidos/${pedido.pedido_id}`)}
                    className="text-green-600 hover:text-green-700 font-semibold text-sm"
                  >
                    Ver Detalhes →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
