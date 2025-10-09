import api from './api';

export interface Vendedor {
  id_vendedor: string;
  nome: string;
  telefone: string;
  endereco_venda: string;
  tipo_vendedor: 'PF' | 'PJ';
  tipo_documento: 'CPF' | 'CNPJ';
  numero_documento: string;
  fk_associacao?: string;
}

export interface CreateVendedorData {
  nome: string;
  telefone: string;
  endereco_venda: string;
  tipo_vendedor: 'PF' | 'PJ';
  tipo_documento: 'CPF' | 'CNPJ';
  numero_documento: string;
  senha: string;
  fk_associacao?: string;
}

export interface UpdateVendedorData {
  nome?: string;
  telefone?: string;
  endereco_venda?: string;
  tipo_vendedor?: 'PF' | 'PJ';
  tipo_documento?: 'CPF' | 'CNPJ';
  numero_documento?: string;
  senha?: string;
  fk_associacao?: string;
}

class VendedorService {
  // Listar todos os vendedores
  async listarTodos(): Promise<Vendedor[]> {
    try {
      console.log('🔍 Buscando todos os vendedores...');
      const response = await api.get('/vendedor');
      console.log('✅ Vendedores encontrados:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar vendedores:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar vendedores'
      );
    }
  }

  // Buscar vendedor por ID
  async buscarPorId(id: string): Promise<Vendedor> {
    try {
      console.log('🔍 Buscando vendedor:', id);
      const response = await api.get(`/vendedor/${id}`);
      console.log('✅ Vendedor encontrado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar vendedor:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar vendedor'
      );
    }
  }

  // Buscar vendedor por documento (CPF/CNPJ)
  async buscarPorDocumento(numero_documento: string): Promise<Vendedor> {
    try {
      console.log('🔍 Buscando vendedor por documento:', numero_documento);
      const response = await api.get(`/vendedor/documento/${numero_documento}`);
      console.log('✅ Vendedor encontrado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar vendedor por documento:', error);
      throw new Error(
        error.response?.data?.message || 'Vendedor não encontrado'
      );
    }
  }

  // Criar novo vendedor
  async criar(data: CreateVendedorData): Promise<Vendedor> {
    try {
      console.log('📝 Criando novo vendedor...');
      console.log('📋 Dados enviados:', data);

      // Limpar formatação do telefone e documento
      const dadosLimpos = {
        ...data,
        telefone: data.telefone.replace(/\D/g, ''),
        numero_documento: data.numero_documento.replace(/\D/g, ''),
      };

      const response = await api.post('/vendedor/cadastro', dadosLimpos);

      console.log('✅ Vendedor criado com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar vendedor:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Erro ao criar vendedor'
      );
    }
  }

  // Atualizar vendedor
  async atualizar(id: string, data: UpdateVendedorData): Promise<Vendedor> {
    try {
      console.log('📝 Atualizando vendedor:', id);
      console.log('📋 Dados enviados:', data);

      // Limpar formatação se os campos estiverem presentes
      const dadosLimpos: any = { ...data };
      if (data.telefone) {
        dadosLimpos.telefone = data.telefone.replace(/\D/g, '');
      }
      if (data.numero_documento) {
        dadosLimpos.numero_documento = data.numero_documento.replace(/\D/g, '');
      }

      const response = await api.put(`/vendedor/${id}`, dadosLimpos);

      console.log('✅ Vendedor atualizado com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar vendedor:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Erro ao atualizar vendedor'
      );
    }
  }

  // Deletar vendedor
  async deletar(id: string): Promise<void> {
    try {
      console.log('🗑️ Deletando vendedor:', id);
      await api.delete(`/vendedor/${id}`);
      console.log('✅ Vendedor deletado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao deletar vendedor:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      throw new Error(
        error.response?.data?.message || 'Erro ao deletar vendedor'
      );
    }
  }
}

export default new VendedorService();
