import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import pedidoService from '../../services/pedidoService';
import type { Pedido } from '../../services/pedidoService';
import { useAuth } from '../../contexts/AuthContext';

export default function MeusPedidos() {
  const navigate = useNavigate();
  const { isAuthenticated, isCliente } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    if (!isAuthenticated) {
      setErro('Você precisa estar logado para ver seus pedidos.');
      setCarregando(false);
      return;
    }

    if (!isCliente) {
      setErro('Apenas clientes podem acessar Meus Pedidos.');
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro(null);
      
      const dados = await pedidoService.listarPedidos();
      setPedidos(dados);
      
    } catch (error: any) {
      
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

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getItensPedido = (pedido: Pedido) => {
    if (Array.isArray(pedido.produtos_no_pedido) && pedido.produtos_no_pedido.length > 0) return pedido.produtos_no_pedido;
    if (Array.isArray(pedido.atende_um) && pedido.atende_um.length > 0) return pedido.atende_um;
    return [];
  };

  const getNomeProduto = (item: any) => item?.produto?.nome || item?.produto?.nome_produto || item?.nome || `Produto ${item?.fk_produto || ''}`;

  const getQuantidadeItem = (item: any) => Number(item?.quantidade ?? item?.qty ?? 1) || 1;

  const getValorUnitario = (item: any) => {
    const valor = Number(item?.preco ?? item?.valor ?? item?.valor_unitario ?? item?.produto?.preco ?? item?.produto?.valor ?? item?.produto?.preco_venda ?? 0);
    return Number.isNaN(valor) ? 0 : valor;
  };

  const getVendedorItem = (item: any) => item?.produto?.vendedor || item?.vendedor || item?.vendedor_info || item?.associacao || null;

  const getStatusPedido = (pedido: Pedido) => {
    return String((pedido as any)?.status || (pedido as any)?.pagamento?.status || '-').toUpperCase();
  };

  const pedidoFoiPago = (pedido: Pedido) => {
    const status = getStatusPedido(pedido);
    return ['PAGO', 'APROVADO', 'APPROVED', 'PAID'].includes(status);
  };

  const getTotalPedido = (pedido: Pedido) => {
    const itens = getItensPedido(pedido);
    return itens.reduce((acc, item) => acc + (getQuantidadeItem(item) * getValorUnitario(item)), 0);
  };

  const baixarComprovantePDF = (pedido: Pedido) => {
    const doc = new jsPDF();
    const margemX = 14;
    let y = 16;

    const titulo = `Comprovante do Pedido #${pedido.pedido_id}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(titulo, margemX, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margemX, y);
    y += 10;

    doc.setDrawColor(210, 210, 210);
    doc.line(margemX, y, 196, y);
    y += 8;

    const clienteNome = (pedido as any)?.cliente?.nome || '-';
    const clienteCpf = (pedido as any)?.cliente?.cpf || '-';
    const feiraNome = pedido.feira?.nome || `Feira #${pedido.fk_feira}` || '-';
    const retiradaNome = pedido.feira_retirada?.nome || pedido.associacao_retirada?.nome || pedido.retirada_local || 'Não informado';
    const retiradaEndereco = pedido.feira_retirada?.localizacao || pedido.associacao_retirada?.endereco || '';
    const retiradaHorario = pedido.feira_retirada?.data_hora || pedido.associacao_retirada?.data_hora || '';

    const dadosBloco = [
      `Data do pedido: ${formatarData(pedido.data_pedido)}`,
      `Cliente: ${clienteNome}`,
      `CPF: ${clienteCpf}`,
      `Feira: ${feiraNome}`,
      `Local de retirada: ${retiradaNome}`,
      retiradaEndereco ? `Endereço: ${retiradaEndereco}` : '',
      retiradaHorario ? `Horário: ${retiradaHorario}` : '',
      `Status: ${getStatusPedido(pedido)}`,
      `Pagamento: ${pedidoFoiPago(pedido) ? 'Confirmado' : 'Pendente'}`,
    ].filter(Boolean);

    dadosBloco.forEach((linha) => {
      const wrapped = doc.splitTextToSize(linha, 180);
      doc.text(wrapped, margemX, y);
      y += wrapped.length * 6;
    });

    y += 4;
    doc.setDrawColor(210, 210, 210);
    doc.line(margemX, y, 196, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Produtos', margemX, y);
    y += 7;

    const itens = getItensPedido(pedido);
    if (itens.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.text('Nenhum item encontrado.', margemX, y);
      y += 8;
    } else {
      itens.forEach((item) => {
        const vendedor = getVendedorItem(item);
        const nomeVendedor = vendedor?.nome || vendedor?.nome_vendedor || '-';
        const quantidade = getQuantidadeItem(item);
        const valorUnit = getValorUnitario(item);
        const valorTotal = quantidade * valorUnit;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const nomeProduto = doc.splitTextToSize(getNomeProduto(item), 140);
        doc.text(nomeProduto, margemX, y);
        y += nomeProduto.length * 5;

        doc.setFont('helvetica', 'normal');
        doc.text(`Quantidade: ${quantidade}`, margemX, y);
        y += 5;
        doc.text(`Vendedor: ${nomeVendedor}`, margemX, y);
        y += 5;
        doc.text(`Valor unitário: ${formatarMoeda(valorUnit)}`, margemX, y);
        y += 5;
        doc.text(`Subtotal: ${formatarMoeda(valorTotal)}`, margemX, y);
        y += 7;

        if (y > 270) {
          doc.addPage();
          y = 16;
        }
      });
    }

    y += 2;
    doc.setDrawColor(210, 210, 210);
    doc.line(margemX, y, 196, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.text(`Total do pedido: ${formatarMoeda(getTotalPedido(pedido))}`, margemX, y);

    const nomeArquivo = `comprovante_pedido_${pedido.pedido_id}.pdf`;
    doc.save(nomeArquivo);
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
    const acessoNegado = erro.includes('Apenas clientes');

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{acessoNegado ? 'Acesso negado' : 'Erro'}</h2>
          <p className="text-gray-600 mb-6">{erro}</p>
          <div className="flex gap-4 justify-center">
            {acessoNegado ? (
              <button
                onClick={() => navigate('/perfil')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Ir para meu perfil
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Fazer Login
              </button>
            )}
            <button
              onClick={buscarPedidos}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              {acessoNegado ? 'Voltar' : 'Tentar Novamente'}
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Meus Pedidos</h1>
              <p className="text-sm text-gray-600 mt-1">
                Baixe o comprovante em PDF de cada pedido para guardar ou mostrar o pagamento.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/produtos')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Fazer Novo Pedido
              </button>
              {pedidos.length > 0 && (
                <span className="inline-flex items-center px-4 py-3 rounded-lg bg-green-50 text-green-700 border border-green-200 font-semibold text-sm">
                  PDF disponível em cada pedido abaixo
                </span>
              )}
            </div>
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

                {(pedido.feira_retirada || pedido.associacao_retirada || pedido.retirada_local) && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-gray-700">
                      <strong>Feira de retirada:</strong>{' '}
                      {pedido.feira_retirada?.nome || pedido.associacao_retirada?.nome || pedido.retirada_local || 'Local informado no pedido'}
                    </p>
                    {(pedido.feira_retirada?.localizacao || pedido.feira_retirada?.data_hora || pedido.associacao_retirada?.endereco || pedido.associacao_retirada?.data_hora) && (
                      <p className="text-xs text-gray-600 mt-1">
                        {pedido.feira_retirada?.localizacao || pedido.associacao_retirada?.endereco || 'Endereço não informado'}
                        {(pedido.feira_retirada?.data_hora || pedido.associacao_retirada?.data_hora) ? ` • ${pedido.feira_retirada?.data_hora || pedido.associacao_retirada?.data_hora}` : ''}
                      </p>
                    )}
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      onClick={() => navigate(`/pedidos/${pedido.pedido_id}`)}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm"
                    >
                      Ver Detalhes →
                    </button>
                    <button
                      onClick={() => baixarComprovantePDF(pedido)}
                      className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold w-full sm:w-auto"
                    >
                      Baixar comprovante PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
