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
      const response = await api.get('/vendedor');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar vendedores'
      );
    }
  }

  // Buscar vendedor por ID
  async buscarPorId(id: string): Promise<Vendedor> {
    try {
      const response = await api.get(`/vendedor/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erro ao buscar vendedor'
      );
    }
  }

  // Buscar vendedor por documento (CPF/CNPJ)
  async buscarPorDocumento(numero_documento: string): Promise<Vendedor> {
    try {
      const response = await api.get(`/vendedor/documento/${numero_documento}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Vendedor não encontrado'
      );
    }
  }

  // Criar novo vendedor
  async criar(data: CreateVendedorData): Promise<Vendedor> {
    try {

      // Limpar formatação do telefone e documento
      const dadosLimpos = {
        ...data,
        telefone: data.telefone.replace(/\D/g, ''),
        numero_documento: data.numero_documento.replace(/\D/g, ''),
      };

      const response = await api.post('/vendedor/cadastro', dadosLimpos);

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erro ao criar vendedor'
      );
    }
  }

  // Atualizar vendedor
  async atualizar(id: string, data: UpdateVendedorData): Promise<Vendedor> {
    try {

      // Limpar formatação se os campos estiverem presentes
      const dadosLimpos: any = { ...data };
      if (data.telefone) {
        dadosLimpos.telefone = data.telefone.replace(/\D/g, '');
      }
      if (data.numero_documento) {
        dadosLimpos.numero_documento = data.numero_documento.replace(/\D/g, '');
      }

      const response = await api.put(`/vendedor/${id}`, dadosLimpos);

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erro ao atualizar vendedor'
      );
    }
  }

  // Deletar vendedor
  async deletar(id: string): Promise<void> {
    try {
      await api.delete(`/vendedor/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Erro ao deletar vendedor'
      );
    }
  }
}

export default new VendedorService();
