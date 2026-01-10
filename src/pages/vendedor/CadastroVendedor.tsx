import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, FileText, Building2, Lock, ArrowLeft } from 'lucide-react';
import vendedorService from '../../services/vendedorService';
import associacaoService from '../../services/associacaoService';
import type { CreateVendedorData } from '../../services/vendedorService';
import type { Associacao } from '../../services/associacaoService';
import { useAuth } from '../../contexts/AuthContext';

const CadastroVendedor: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState<CreateVendedorData>({
    nome: '',
    email: '',
    telefone: '',
    endereco_venda: '',
    tipo_vendedor: 'PF',
    tipo_documento: 'CPF',
    numero_documento: '',
    senha: '',
    fk_associacao: '',
  });

  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Verificar se é admin
  useEffect(() => {
    if (!user) {
      alert('⚠️ Você precisa estar logado como administrador para cadastrar vendedores!');
      navigate('/login');
      return;
    }
    
    if (user.tipo !== 'ADMIN') {
      alert('⚠️ Apenas administradores podem cadastrar vendedores!');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Carregar associações
  useEffect(() => {
    carregarAssociacoes();
  }, []);

  const carregarAssociacoes = async () => {
    try {
      const data = await associacaoService.getAll();
      setAssociacoes(data);
    } catch (error) {
      // Não é crítico, pode prosseguir sem associação
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Aplicar máscaras
    let formattedValue = value;
    if (name === 'telefone') {
      formattedValue = aplicarMascaraTelefone(value);
    } else if (name === 'numero_documento') {
      if (formData.tipo_documento === 'CPF') {
        formattedValue = aplicarMascaraCPF(value);
      } else {
        formattedValue = aplicarMascaraCNPJ(value);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTipoDocumentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipoDocumento = e.target.value as 'CPF' | 'CNPJ';
    setFormData(prev => ({
      ...prev,
      tipo_documento: tipoDocumento,
      numero_documento: '', // Limpar documento ao trocar tipo
    }));
  };

  const aplicarMascaraTelefone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const aplicarMascaraCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '').substring(0, 11);
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  };

  const aplicarMascaraCNPJ = (value: string): string => {
    const numbers = value.replace(/\D/g, '').substring(0, 14);
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
  };

  const validarFormulario = (): boolean => {
    const novosErros: {[key: string]: string} = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = 'Email inválido';
    }

    const telefone = formData.telefone.replace(/\D/g, '');
    if (!telefone) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (telefone.length < 10) {
      novosErros.telefone = 'Telefone inválido';
    }

    if (!formData.endereco_venda.trim()) {
      novosErros.endereco_venda = 'Endereço de venda é obrigatório';
    }

    const documento = formData.numero_documento.replace(/\D/g, '');
    if (!documento) {
      novosErros.numero_documento = `${formData.tipo_documento} é obrigatório`;
    } else if (formData.tipo_documento === 'CPF' && documento.length !== 11) {
      novosErros.numero_documento = 'CPF inválido (deve ter 11 dígitos)';
    } else if (formData.tipo_documento === 'CNPJ' && documento.length !== 14) {
      novosErros.numero_documento = 'CNPJ inválido (deve ter 14 dígitos)';
    }

    if (!formData.fk_associacao || formData.fk_associacao.trim() === '') {
      novosErros.fk_associacao = 'Associação é obrigatória';
    }

    if (!formData.senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (formData.senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const result = await vendedorService.criar(formData);
      
      
      // Exibir UUID do vendedor
      const uuid = result.id_vendedor || 'N/A';
      
      alert(
        `✅ Vendedor cadastrado com sucesso!\n\n` +
        `🔑 IMPORTANTE: Guarde seu ID para fazer login:\n\n` +
        `${uuid}\n\n` +
        `Você será redirecionado para a página de login em 5 segundos...`
      );
      
      // Aguardar 5 segundos e redirecionar para login
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      
    } catch (error: any) {
      console.error('Erro ao cadastrar vendedor:', error);
      
      // Tratar erro 400 de associação obrigatória
      if (error.response?.status === 400) {
        const mensagem = error.response?.data?.error || error.response?.data?.message || error.message;
        
        if (mensagem.toLowerCase().includes('associação')) {
          setErrors({ fk_associacao: mensagem });
          alert(`❌ ${mensagem}`);
        } else {
          alert(`❌ ${mensagem}`);
        }
      } else {
        alert(`❌ ${error.message || 'Erro ao cadastrar vendedor'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Cadastro de Vendedor</h1>
          <p className="text-gray-600 mt-2">Preencha os dados para cadastrar um novo vendedor</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          
          {/* Tipo de Vendedor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Vendedor *
              </label>
              <select
                name="tipo_vendedor"
                value={formData.tipo_vendedor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="PF">Pessoa Física (PF)</option>
                <option value="PJ">Pessoa Jurídica (PJ)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento *
              </label>
              <select
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleTipoDocumentoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </select>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline mr-2" size={16} />
              Nome Completo / Razão Social *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.nome ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite o nome completo"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline mr-2" size={16} />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite o email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline mr-2" size={16} />
              {formData.tipo_documento} *
            </label>
            <input
              type="text"
              name="numero_documento"
              value={formData.numero_documento}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.numero_documento ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={formData.tipo_documento === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
            />
            {errors.numero_documento && <p className="text-red-500 text-sm mt-1">{errors.numero_documento}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline mr-2" size={16} />
              Telefone *
            </label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.telefone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(00) 00000-0000"
            />
            {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
          </div>

          {/* Endereço de Venda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline mr-2" size={16} />
              Endereço de Venda *
            </label>
            <textarea
              name="endereco_venda"
              value={formData.endereco_venda}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.endereco_venda ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Rua, número, bairro, cidade..."
            />
            {errors.endereco_venda && <p className="text-red-500 text-sm mt-1">{errors.endereco_venda}</p>}
          </div>

          {/* Associação (obrigatório) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="inline mr-2" size={16} />
              Associação *
            </label>
            <select
              name="fk_associacao"
              value={formData.fk_associacao}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.fk_associacao ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma associação</option>
              {associacoes.map((assoc) => (
                <option key={assoc.id_associacao} value={assoc.id_associacao}>
                  {assoc.nome}
                </option>
              ))}
            </select>
            {errors.fk_associacao && <p className="text-red-500 text-sm mt-1">{errors.fk_associacao}</p>}
            {associacoes.length === 0 && (
              <p className="text-amber-600 text-sm mt-1">
                ⚠️ Nenhuma associação disponível. Entre em contato com o administrador.
              </p>
            )}
          </div>

          {/* Senha */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline mr-2" size={16} />
                Senha *
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.senha ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline mr-2" size={16} />
                Confirmar Senha *
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => {
                  setConfirmarSenha(e.target.value);
                  if (errors.confirmarSenha) {
                    setErrors(prev => ({ ...prev, confirmarSenha: '' }));
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.confirmarSenha ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Repita a senha"
              />
              {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Vendedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroVendedor;
