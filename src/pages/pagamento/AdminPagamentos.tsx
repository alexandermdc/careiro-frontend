import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout';
import pedidoService from '../../services/pedidoService';
import Modal from '../../components/Modal';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminPagamentos: React.FC = () => {
	const { user, isAdmin } = useAuth();
	const navigate = useNavigate();

	const [statusFiltro, setStatusFiltro] = useState<string>('PENDENTE');
	const [limitFiltro, setLimitFiltro] = useState<number | undefined>(50);
	const [paginaFiltro, setPaginaFiltro] = useState<number>(1);
	const [paymentIdBusca, setPaymentIdBusca] = useState<string>('');
	const [resultadosPagamentos, setResultadosPagamentos] = useState<any[] | null>(null);
	const [metaPagamentos, setMetaPagamentos] = useState<any | null>(null);
	const [pedidoEncontrado, setPedidoEncontrado] = useState<any | null>(null);
	const [loadingPagamentos, setLoadingPagamentos] = useState(false);
	const [errorPagamentos, setErrorPagamentos] = useState<string | null>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalPedido, setModalPedido] = useState<any | null>(null);

	useEffect(() => {
		if (!user) {
			navigate('/login');
			return;
		}
		if (!isAdmin) {
			alert('⚠️ Acesso negado! Apenas administradores podem acessar esta página.');
			navigate('/');
			return;
		}
	}, [user, isAdmin, navigate]);

	useEffect(() => {
		if (!isAdmin) return;
		const carregarPedidos = async () => {
			try {
				setLoadingPagamentos(true);
				setErrorPagamentos(null);
				const res = await pedidoService.listarPorStatus(statusFiltro, paginaFiltro, limitFiltro ?? 25);
				setResultadosPagamentos(res.data || []);
				setMetaPagamentos(res.meta || null);
			} catch (err: any) {
				setErrorPagamentos(err.message || 'Erro ao carregar pedidos');
			} finally {
				setLoadingPagamentos(false);
			}
		};
		carregarPedidos();
	}, [isAdmin, statusFiltro, paginaFiltro, limitFiltro]);

	const formatCPF = (cpf?: string) => {
		if (!cpf) return '-';
		const digits = cpf.replace(/\D/g, '');
		return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	};

	const formatPhone = (phone?: string) => {
		if (!phone) return '-';
		const digits = phone.replace(/\D/g, '');
		if (digits.length === 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
		if (digits.length === 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
		return phone;
	};

	const formatCurrency = (value: any) => {
		const n = Number(value);
		if (Number.isNaN(n)) return '-';
		return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	};

	const produtoNome = (item: any) => {
		if (!item) return '-';
		if (item.produto && (item.produto.nome || item.produto.nome_produto)) return item.produto.nome || item.produto.nome_produto;
		if (item.nome) return item.nome;
		return '-';
	};

	const produtoPreco = (item: any) => {
		if (!item) return null;
		const p = item.preco || item.valor || item.valor_unitario || item.produto?.preco || item.produto?.valor || item.produto?.preco_venda;
		return p != null ? formatCurrency(p) : '-';
	};

	const getVendedorTelefone = (v: any) => {
		if (!v) return undefined;
		return (
			v.telefone || v.celular || v.cel || v.phone || v.telefone_principal || v.telefone1 || v.contato?.telefone || v.associacao?.telefone || undefined
		);
	};

	const getVendedorFromItem = (item: any) => {
		if (!item) return null;
		return (
			item.produto?.vendedor || item.vendedor || item.vendedor_info || item.associacao || null
		);
	};

	return (
		<PageLayout>
			<div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-4">
					<ShoppingCart className="w-6 h-6 text-gray-700" />
					<h3 className="text-xl font-bold text-gray-900">Testes de Pagamentos</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					<div className="col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-sm font-medium text-gray-700 mb-2">Listar pedidos por status</p>
						<div className="flex gap-2">
							<select
								value={statusFiltro}
								onChange={(e) => setStatusFiltro(e.target.value)}
								className="flex-1 px-3 py-2 border rounded-lg bg-white"
							>
								<option value="">Todos</option>
								<option value="PENDENTE">PENDENTE</option>
								<option value="PAGO">PAGO</option>
								<option value="APROVADO">APROVADO</option>
								<option value="CANCELADO">CANCELADO</option>
								<option value="ESTORNADO">ESTORNADO</option>
							</select>
							<input
								type="number"
								value={limitFiltro ?? ''}
								onChange={(e) => setLimitFiltro(e.target.value ? parseInt(e.target.value, 10) : undefined)}
								className="w-24 px-3 py-2 border rounded-lg"
								placeholder="limit"
							/>
							<button
								onClick={async () => {
									try {
										setLoadingPagamentos(true);
										setErrorPagamentos(null);
										setPedidoEncontrado(null);
										const res = await pedidoService.listarPorStatus(statusFiltro, paginaFiltro, limitFiltro ?? 25);
										setResultadosPagamentos(res.data || []);
										setMetaPagamentos(res.meta || null);
									} catch (err: any) {
										setErrorPagamentos(err.message || 'Erro ao listar pedidos por status');
										setResultadosPagamentos(null);
										setMetaPagamentos(null);
									} finally {
										setLoadingPagamentos(false);
									}
								}}
								className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
							>
								{loadingPagamentos ? 'Carregando...' : 'Listar'}
							</button>
						</div>
					</div>

					<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-sm font-medium text-gray-700 mb-2">Buscar por paymentId</p>
						<div className="flex gap-2">
							<input
								value={paymentIdBusca}
								onChange={(e) => setPaymentIdBusca(e.target.value)}
								className="flex-1 px-3 py-2 border rounded-lg"
								placeholder="mercadopago_payment_id"
							/>
							<button
								onClick={async () => {
									try {
										setLoadingPagamentos(true);
										setErrorPagamentos(null);
										setResultadosPagamentos(null);
										const res = await pedidoService.buscarPorPaymentId(paymentIdBusca);
										setPedidoEncontrado(res);
									} catch (err: any) {
										setErrorPagamentos(err.message || 'Erro ao buscar pedido por paymentId');
										setPedidoEncontrado(null);
									} finally {
										setLoadingPagamentos(false);
									}
								}}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg"
							>
								{loadingPagamentos ? 'Carregando...' : 'Buscar'}
							</button>
						</div>
					</div>
				</div>

				{errorPagamentos && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
						{errorPagamentos}
					</div>
				)}

				{resultadosPagamentos && (
					<div className="mb-4">
						<h4 className="font-semibold mb-2">Pedidos encontrados: {resultadosPagamentos.length}</h4>
						{metaPagamentos && (
							<p className="text-sm text-gray-600 mb-2">Página {metaPagamentos.page} de {metaPagamentos.totalPages} — Total: {metaPagamentos.total}</p>
						)}
						<div className="overflow-x-auto bg-white rounded border">
							<table className="w-full">
								<thead className="bg-gray-50 border-b">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pedido</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payer Email / PaymentId</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedores</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-100">
									{resultadosPagamentos.map((pedido: any) => {
										const vendedores = (pedido.produtos_no_pedido || []).map((p: any) => p.produto?.vendedor).filter(Boolean);
										const vendedoresUnicos = Array.from(new Map(vendedores.map((v: any) => [v.id_vendedor, v])).values());
										return (
											<React.Fragment key={pedido.pedido_id}>
												<tr className="hover:bg-gray-50">
													<td className="px-4 py-3 text-sm text-gray-900">#{pedido.pedido_id}</td>
													<td className="px-4 py-3 text-sm text-gray-700">{pedido.data_pedido}</td>
													<td className="px-4 py-3 text-sm text-gray-700">{pedido.status}</td>
													<td className="px-4 py-3 text-sm text-gray-700">{pedido.payer_email || pedido.mercadopago_payment_id || '-'}</td>
													<td className="px-4 py-3 text-sm text-gray-700">
														{vendedoresUnicos.length > 0 ? (
															<div className="flex flex-col">
																{vendedoresUnicos.map((v: any) => {
																	const tel = getVendedorTelefone(v);
																	return (
																		<span key={v.id_vendedor} className="text-xs">
																			{v.nome}{tel ? ` (${formatPhone(tel)})` : ''}
																		</span>
																	);
																})}
															</div>
														) : (
															<span className="text-xs text-gray-400">—</span>
														)}
													</td>
													<td className="px-4 py-3 text-right">
														<button
															onClick={() => {
																setModalPedido(pedido);
																setIsModalOpen(true);
															}}
															className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
														>
															Detalhes
														</button>
													</td>
												</tr>
											</React.Fragment>
										);
									})}
								</tbody>
							</table>
						</div>
						{metaPagamentos && (
							<div className="flex gap-2 mt-3">
								<button
									disabled={metaPagamentos.page <= 1}
									onClick={async () => {
										const nova = Math.max(1, (metaPagamentos.page || paginaFiltro) - 1);
										setPaginaFiltro(nova);
										try {
											setLoadingPagamentos(true);
											const res = await pedidoService.listarPorStatus(statusFiltro, nova, limitFiltro ?? 25);
											setResultadosPagamentos(res.data || []);
											setMetaPagamentos(res.meta || null);
										} catch (err: any) {
											setErrorPagamentos(err.message || 'Erro ao carregar página');
										} finally {
											setLoadingPagamentos(false);
										}
									}}
									className="px-3 py-1 bg-gray-200 rounded"
								>
									Anterior
								</button>
								<button
									disabled={metaPagamentos.page >= metaPagamentos.totalPages}
									onClick={async () => {
										const nova = Math.min(metaPagamentos.totalPages, (metaPagamentos.page || paginaFiltro) + 1);
										setPaginaFiltro(nova);
										try {
											setLoadingPagamentos(true);
											const res = await pedidoService.listarPorStatus(statusFiltro, nova, limitFiltro ?? 25);
											setResultadosPagamentos(res.data || []);
											setMetaPagamentos(res.meta || null);
										} catch (err: any) {
											setErrorPagamentos(err.message || 'Erro ao carregar página');
										} finally {
											setLoadingPagamentos(false);
										}
									}}
									className="px-3 py-1 bg-gray-200 rounded"
								>
									Próxima
								</button>
							</div>
						)}
					</div>
				)}

				{pedidoEncontrado && (
					<div className="mb-4">
						<h4 className="font-semibold mb-2">Pedido encontrado</h4>
						<div className="bg-white p-3 rounded border text-sm">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<h5 className="font-semibold mb-2">Cliente</h5>
									<div className="text-sm">
										<div><strong>Nome:</strong> {pedidoEncontrado.cliente?.nome || '-'}</div>
										<div><strong>CPF:</strong> {formatCPF(pedidoEncontrado.cliente?.cpf)}</div>
										<div><strong>Email:</strong> {pedidoEncontrado.cliente?.email || '-'}</div>
									</div>
								</div>
								<div>
									<h5 className="font-semibold mb-2">Produtos</h5>
									<div className="text-sm">
										{Array.isArray(pedidoEncontrado.produtos_no_pedido) && pedidoEncontrado.produtos_no_pedido.length > 0 ? (
											<ul className="space-y-2">
												{pedidoEncontrado.produtos_no_pedido.map((item: any, idx: number) => {
													const vendedor = getVendedorFromItem(item);
													const tel = getVendedorTelefone(vendedor);
													return (
														<li key={idx} className="flex flex-col md:flex-row md:justify-between gap-2">
															<div>
																<div>{produtoNome(item)}</div>
																<div className="text-xs text-gray-500">
																	<span>Qtd: {item.quantidade ?? item.qty ?? 1}</span>
																	{vendedor && (
																		<span className="ml-2"> — Vendedor: {vendedor.nome || vendedor.nome_vendedor || '-'}{tel ? ` (${formatPhone(tel)})` : ''}</span>
																	)}
																</div>
															</div>
														</li>
													);
												})}
											</ul>
										) : (
											<div className="text-sm text-gray-500">Nenhum produto listado</div>
										)}
									</div>
								</div>
								<div>
									<h5 className="font-semibold mb-2">Transação</h5>
									<div className="text-sm">
										<div><strong>Status:</strong> {pedidoEncontrado.status || '-'}</div>
										<div><strong>Valor:</strong> {formatCurrency(pedidoEncontrado.valor_total ?? pedidoEncontrado.total)}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{modalPedido && (
					<Modal
						isOpen={isModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							setModalPedido(null);
						}}
						title={`Pedido #${modalPedido.pedido_id}`}
						maxWidth="2xl"
					>
						<div className="overflow-x-hidden">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
								<div className="min-w-0">
									<h5 className="font-semibold mb-3">Cliente</h5>
									<div className="bg-white p-3 rounded border space-y-2 text-sm">
										<div><span className="font-medium">Nome:</span> <span className="ml-2 break-words">{modalPedido.cliente?.nome || '-'}</span></div>
										<div><span className="font-medium">CPF:</span> <span className="ml-2">{formatCPF(modalPedido.cliente?.cpf)}</span></div>
										<div><span className="font-medium">E-mail:</span> <span className="ml-2 break-words">{modalPedido.cliente?.email || '-'}</span></div>
										<div><span className="font-medium">Telefone:</span> <span className="ml-2">{formatPhone(modalPedido.cliente?.telefone)}</span></div>
									</div>
								</div>

								<div className="min-w-0">
									<h5 className="font-semibold mb-3">Produtos</h5>
									<div className="bg-white p-3 rounded border text-sm max-h-72 overflow-auto">
										{Array.isArray(modalPedido.produtos_no_pedido) && modalPedido.produtos_no_pedido.length > 0 ? (
											<ul className="space-y-3">
												{modalPedido.produtos_no_pedido.map((item: any, idx: number) => {
													const vendedor = getVendedorFromItem(item);
													const tel = getVendedorTelefone(vendedor);
													return (
														<li key={idx} className="w-full flex flex-col md:flex-row md:justify-between items-start gap-4">
															<div className="min-w-0">
																<div className="font-medium break-words">{produtoNome(item)}</div>
																<div className="text-xs text-gray-600">
																	<span>Quantidade: {item.quantidade ?? item.qty ?? 1}</span>
																	{vendedor && (
																		<span className="ml-2"> — Vendedor: {vendedor.nome || vendedor.nome_vendedor || '-'}{tel ? ` (${formatPhone(tel)})` : ''}</span>
																	)}
																</div>
															</div>
															<div className="text-sm text-gray-800 whitespace-nowrap">{produtoPreco(item)}</div>
														</li>
													);
												})}
											</ul>
										) : (
											<div className="text-sm text-gray-500">Nenhum produto listado</div>
										)}
									</div>
								</div>

								<div className="min-w-0">
									<h5 className="font-semibold mb-3">Transação</h5>
									<div className="bg-white p-3 rounded border text-sm space-y-2">
										<div><span className="font-medium">Payment ID:</span> <span className="ml-2 break-words">{modalPedido.mercadopago_payment_id || '-'}</span></div>
										<div><span className="font-medium">Payer Email:</span> <span className="ml-2 break-words">{modalPedido.payer_email || modalPedido.pagamento?.payer_email || '-'}</span></div>
										<div><span className="font-medium">Status:</span> <span className="ml-2">{modalPedido.status || modalPedido.pagamento?.status || '-'}</span></div>
										<div><span className="font-medium">Valor:</span> <span className="ml-2">{formatCurrency(modalPedido.valor_total ?? modalPedido.total ?? modalPedido.pagamento?.transaction_amount ?? modalPedido.pagamento?.amount)}</span></div>
									</div>
								</div>
							</div>
						</div>
					</Modal>
				)}
			</div>
		</PageLayout>
	);
};

export default AdminPagamentos;

