import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout';
import pedidoService, { type PedidoAdmin } from '../../services/pedidoService';
import Modal from '../../components/Modal';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminPagamentos: React.FC = () => {
	const { user, isAdmin } = useAuth();
	const navigate = useNavigate();

	const [statusFiltro, setStatusFiltro] = useState<string>('');
	const [limitFiltro, setLimitFiltro] = useState<number | undefined>(50);
	const [paginaFiltro, setPaginaFiltro] = useState<number>(1);
	const [paymentIdBusca, setPaymentIdBusca] = useState<string>('');
	const [resultadosPagamentos, setResultadosPagamentos] = useState<PedidoAdmin[] | null>(null);
	const [metaPagamentos, setMetaPagamentos] = useState<any | null>(null);
	const [pedidoEncontrado, setPedidoEncontrado] = useState<PedidoAdmin | null>(null);
	const [loadingPagamentos, setLoadingPagamentos] = useState(false);
	const [errorPagamentos, setErrorPagamentos] = useState<string | null>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalPedido, setModalPedido] = useState<PedidoAdmin | null>(null);

	const fetchPedidos = async (status?: string, page?: number, limit?: number) => {
		try {
			setLoadingPagamentos(true);
			setErrorPagamentos(null);
			const opts: any = { page: page ?? 1, limit: limit ?? 25 };
			if (status) opts.status = status;
			const res = await pedidoService.listarAdminPedidos(opts);
			setResultadosPagamentos(res.data || []);
			setMetaPagamentos(res.meta || null);
		} catch (err: any) {
			setErrorPagamentos(err.message || 'Erro ao carregar pedidos');
		} finally {
			setLoadingPagamentos(false);
		}
	};

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
		fetchPedidos(statusFiltro, paginaFiltro, limitFiltro ?? 25);
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

	const getItensPedido = (pedido: PedidoAdmin | null): any[] => {
		if (Array.isArray(pedido?.produtos_no_pedido)) return pedido.produtos_no_pedido;
		if (Array.isArray(pedido?.atende_um)) return pedido.atende_um;
		return [];
	};

	const getQuantidadeItem = (item: any): number => {
		const q = Number(item?.quantidade ?? item?.qty ?? 1);
		return Number.isNaN(q) ? 1 : q;
	};

	const getValorUnitarioItem = (item: any): number => {
		const valor = Number(
			item?.preco ?? item?.valor ?? item?.valor_unitario ?? item?.produto?.preco ?? item?.produto?.valor ?? item?.produto?.preco_venda ?? 0
		);
		return Number.isNaN(valor) ? 0 : valor;
	};

	const getPedidoTotal = (pedido: PedidoAdmin | null): number => {
		const explicito = Number(pedido?.valor_total ?? pedido?.total ?? pedido?.pagamento?.transaction_amount ?? pedido?.pagamento?.amount ?? NaN);
		if (!Number.isNaN(explicito)) return explicito;

		const itens = getItensPedido(pedido);
		return itens.reduce((acc: number, item: any) => acc + (getQuantidadeItem(item) * getValorUnitarioItem(item)), 0);
	};

	const getComprador = (pedido: PedidoAdmin | null) => {
		return pedido?.cliente?.nome || pedido?.comprador?.nome || pedido?.nome_cliente || '-';
	};

	const getAssociacao = (pedido: PedidoAdmin | null) => {
		return (
			pedido?.associacao_retirada?.nome ||
			pedido?.associacao?.nome ||
			pedido?.nome_associacao ||
			'-'
		);
	};

	const getRetirada = (pedido: PedidoAdmin | null) => {
		return pedido?.retirada_local || pedido?.associacao_retirada?.endereco || pedido?.associacao_retirada?.data_hora || '-';
	};

	const csvEscape = (value: any) => {
		if (value === null || value === undefined) return '""';
		return `"${String(value).replace(/"/g, '""')}"`;
	};

	const getResumoItens = (pedido: PedidoAdmin | null) => {
		const itens = getItensPedido(pedido);
		if (!itens.length) return '-';
		return itens
			.map((item: any) => `${produtoNome(item)} x${getQuantidadeItem(item)}`)
			.join(' | ');
	};

	const exportarCSV = () => {
		const pedidos = resultadosPagamentos || [];
		if (!pedidos.length) return;

		const cabecalho = [
			'Pedido',
			'Data',
			'Comprador',
			'CPF',
			'E-mail',
			'Status',
			'Pago',
			'Valor Total',
			'Associação',
			'Retirada',
			'Feira',
			'Payment ID',
			'Payer Email',
			'Vendedores',
			'Itens',
		];

		const linhas = pedidos.map((pedido) => {
			const vendedores = getVendedoresUnicosPedido(pedido)
				.map((v: any) => v?.nome || v?.nome_vendedor || '-')
				.filter(Boolean)
				.join(' | ') || '-';

			return [
				pedido?.pedido_id,
				formatarDataHora(pedido?.data_pedido),
				getComprador(pedido),
				pedido?.cliente?.cpf || '-',
				pedido?.cliente?.email || '-',
				getStatusPedido(pedido),
				isPago(pedido) ? 'Sim' : 'Não',
				formatCurrency(getPedidoTotal(pedido)),
				getAssociacao(pedido),
				getRetirada(pedido),
				pedido?.feira?.nome || pedido?.nome_feira || pedido?.fk_feira || '-',
				pedido?.mercadopago_payment_id || '-',
				pedido?.payer_email || pedido?.pagamento?.payer_email || '-',
				vendedores,
				getResumoItens(pedido),
			].map(csvEscape).join(';');
		});

		const csv = [cabecalho.map(csvEscape).join(';'), ...linhas].join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `pedidos_controle_${new Date().toISOString().slice(0, 10)}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const getStatusPedido = (pedido: PedidoAdmin | null) => {
		return String(pedido?.status || pedido?.pagamento?.status || '-').toUpperCase();
	};

	const isPago = (pedido: PedidoAdmin | null) => {
		const status = getStatusPedido(pedido);
		return ['PAGO', 'APROVADO', 'APPROVED', 'PAID'].includes(status);
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

	const getVendedoresUnicosPedido = (pedido: PedidoAdmin | null) => {
		const itens = getItensPedido(pedido);
		const vendedores = itens.map((item: any) => getVendedorFromItem(item)).filter(Boolean);
		return Array.from(new Map(vendedores.map((v: any) => [v.id_vendedor || v.id || v.nome, v])).values());
	};

	const totalPedidos = resultadosPagamentos?.length || 0;
	const totalValorPedidos = (resultadosPagamentos || []).reduce((acc, pedido) => acc + getPedidoTotal(pedido), 0);
	const totalPedidosPagos = (resultadosPagamentos || []).filter((pedido) => isPago(pedido)).length;
	const totalPedidosNaoPagos = totalPedidos - totalPedidosPagos;

	const formatarDataHora = (valor: string) => {
		if (!valor) return '-';
		const data = new Date(valor);
		if (Number.isNaN(data.getTime())) return valor;
		return data.toLocaleString('pt-BR');
	};

	return (
		<PageLayout>
			<div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-4">
					<ShoppingCart className="w-6 h-6 text-gray-700" />
					<h3 className="text-xl font-bold text-gray-900">Controle de Pedidos</h3>
				</div>
				<p className="text-sm text-gray-600 mb-4">
					Visualize pedidos com comprador, vendedores, itens, status de pagamento, associação, retirada e total para controle interno.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					<div className="col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-sm font-medium text-gray-700 mb-2">Listar pedidos (todos ou por status)</p>
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
									setPedidoEncontrado(null);
									await fetchPedidos(statusFiltro, paginaFiltro, limitFiltro ?? 25);
								}}
								className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
							>
								{loadingPagamentos ? 'Carregando...' : 'Listar'}
							</button>
							<button
								onClick={exportarCSV}
								disabled={!resultadosPagamentos?.length}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
							>
								Baixar CSV
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

				{resultadosPagamentos && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
						<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<p className="text-xs text-gray-500 uppercase">Pedidos</p>
							<p className="text-2xl font-bold text-gray-900">{totalPedidos}</p>
						</div>
						<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<p className="text-xs text-gray-500 uppercase">Valor total</p>
							<p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValorPedidos)}</p>
						</div>
						<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
							<p className="text-xs text-emerald-700 uppercase">Pagos</p>
							<p className="text-2xl font-bold text-emerald-700">{totalPedidosPagos}</p>
						</div>
						<div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
							<p className="text-xs text-amber-700 uppercase">Não pagos</p>
							<p className="text-2xl font-bold text-amber-700">{totalPedidosNaoPagos}</p>
						</div>
					</div>
				)}

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
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comprador</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Associação / Retirada</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedores</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
										<th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pago?</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-100">
									{resultadosPagamentos.map((pedido) => {
										const vendedoresUnicos = getVendedoresUnicosPedido(pedido);
										const itensPedido = getItensPedido(pedido);
										const quantidadeItens = itensPedido.reduce((acc, item) => acc + getQuantidadeItem(item), 0);
										const pedidoPago = isPago(pedido);
										return (
											<React.Fragment key={pedido.pedido_id}>
												<tr className="hover:bg-gray-50">
													<td className="px-4 py-3 text-sm text-gray-900">#{pedido.pedido_id}</td>
													<td className="px-4 py-3 text-sm text-gray-700">{formatarDataHora(pedido.data_pedido)}</td>
													<td className="px-4 py-3 text-sm text-gray-700">{getComprador(pedido)}</td>
													<td className="px-4 py-3 text-sm text-gray-700">
														<div className="flex flex-col">
															<span>{getAssociacao(pedido)}</span>
															<span className="text-xs text-gray-500">Retirada: {getRetirada(pedido)}</span>
														</div>
													</td>
													<td className="px-4 py-3 text-sm text-gray-700">{quantidadeItens} item(ns)</td>
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
													<td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
														{formatCurrency(getPedidoTotal(pedido))}
													</td>
													<td className="px-4 py-3 text-center text-sm">
														<span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${pedidoPago ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
															{pedidoPago ? 'Pago' : 'Não pago'}
														</span>
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
										await fetchPedidos(statusFiltro, nova, limitFiltro ?? 25);
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
										await fetchPedidos(statusFiltro, nova, limitFiltro ?? 25);
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
											<div><strong>Nome:</strong> {getComprador(pedidoEncontrado)}</div>
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
											<div><strong>Status:</strong> {getStatusPedido(pedidoEncontrado)}</div>
											<div><strong>Pago?</strong> {isPago(pedidoEncontrado) ? 'Sim' : 'Não'}</div>
											<div><strong>Valor:</strong> {formatCurrency(getPedidoTotal(pedidoEncontrado))}</div>
											<div><strong>Associação:</strong> {getAssociacao(pedidoEncontrado)}</div>
											<div><strong>Retirada:</strong> {getRetirada(pedidoEncontrado)}</div>
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
										<div><span className="font-medium">Nome:</span> <span className="ml-2 break-words">{getComprador(modalPedido)}</span></div>
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
									<h5 className="font-semibold mb-3">Nota de controle</h5>
									<div className="bg-white p-3 rounded border text-sm space-y-2">
										<div><span className="font-medium">Data do pedido:</span> <span className="ml-2">{formatarDataHora(modalPedido.data_pedido)}</span></div>
										<div><span className="font-medium">Associação:</span> <span className="ml-2 break-words">{getAssociacao(modalPedido)}</span></div>
										<div><span className="font-medium">Retirada:</span> <span className="ml-2 break-words">{getRetirada(modalPedido)}</span></div>
										<div><span className="font-medium">Payment ID:</span> <span className="ml-2 break-words">{modalPedido.mercadopago_payment_id || '-'}</span></div>
										<div><span className="font-medium">Payer Email:</span> <span className="ml-2 break-words">{modalPedido.payer_email || modalPedido.pagamento?.payer_email || '-'}</span></div>
										<div><span className="font-medium">Status:</span> <span className="ml-2">{getStatusPedido(modalPedido)}</span></div>
										<div><span className="font-medium">Pago?</span> <span className="ml-2">{isPago(modalPedido) ? 'Sim' : 'Não'}</span></div>
										<div><span className="font-medium">Valor total:</span> <span className="ml-2">{formatCurrency(getPedidoTotal(modalPedido))}</span></div>
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

