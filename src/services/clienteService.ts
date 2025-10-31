import api from './api';

export interface Cliente {
  cpf: string;        // CPF é a chave primária no seu backend
  nome: string;
  email: string;
  telefone: string;
  senha?: string;     // Opcional para não retornar em GETs
}

export interface CreateClienteData {
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface UpdateClienteData {
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
}

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  imagem?: string;
  categoria?: string;
}

export interface Favorito {
  cliente_cpf: string;
  produto_id: string;
  produto?: Produto;
}

class ClienteService {
  // Listar todos os clientes (rota pública)
  async listarTodos(): Promise<Cliente[]> {
    try {
      console.log('🔍 Buscando todos os clientes...');
      
      const response = await api.get('/clientes');
      
      console.log('✅ Clientes encontrados:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar clientes:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar clientes'
      );
    }
  }

  // Buscar cliente por CPF
  async buscarPorCpf(cpf: string): Promise<Cliente> {
    try {
      console.log('🔍 Buscando cliente por CPF:', cpf);
      
      const response = await api.get(`/clientes/${cpf}`);
      
      console.log('✅ Cliente encontrado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar cliente:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao buscar cliente'
      );
    }
  }

  // Criar novo cliente (cadastro)
  async criar(data: CreateClienteData): Promise<Cliente> {
    try {
      console.log('📝 Criando novo cliente...');
      console.log('📋 Dados enviados:', { ...data, senha: '[OCULTO]' });
      
      const response = await api.post('/clientes', data);
      
      console.log('✅ Cliente criado com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar cliente:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      console.error('🔧 Status do erro:', error.response?.status);
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Erro ao criar cliente'
      );
    }
  }

  // Atualizar cliente (requer autenticação)
  async atualizar(cpf: string, data: UpdateClienteData): Promise<Cliente> {
    try {
      console.log('✏️ Atualizando cliente CPF:', cpf);
      console.log('📋 Dados para atualização (antes da limpeza):', { ...data, senha: data.senha ? '[OCULTO]' : undefined });
      
      // Limpar formatação do telefone (remover parênteses, espaços e hífens)
      const cleanData = { ...data };
      if (cleanData.telefone) {
        cleanData.telefone = cleanData.telefone.replace(/\D/g, ''); // Remove tudo que não é número
        console.log('📞 Telefone limpo:', cleanData.telefone);
      }
      
      console.log('📋 Dados limpos para envio:', { ...cleanData, senha: cleanData.senha ? '[OCULTO]' : undefined });
      
      const response = await api.put(`/clientes/${cpf}`, cleanData);
      
      console.log('✅ Cliente atualizado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar cliente:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao atualizar cliente'
      );
    }
  }

  // Deletar cliente (requer autenticação)
  async deletar(cpf: string): Promise<void> {
    try {
      console.log('🗑️ Deletando cliente CPF:', cpf);
      
      await api.delete(`/clientes/${cpf}`);
      
      console.log('✅ Cliente deletado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao deletar cliente:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao deletar cliente'
      );
    }
  }

  // Adicionar produto aos favoritos (requer autenticação)
  async adicionarFavorito(clienteCpf: string, produtoId: string): Promise<any> {
    try {
      console.log('❤️ Adicionando favorito...');
      console.log('👤 Cliente CPF:', clienteCpf);
      console.log('🛍️ Produto ID:', produtoId);
      
      const response = await api.put(`/clientes/${clienteCpf}/favoritos`, {
        produto_id: produtoId
      });
      
      console.log('✅ Favorito adicionado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao adicionar favorito:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao adicionar favorito'
      );
    }
  }

  // Remover produto dos favoritos (requer autenticação)
  async removerFavorito(clienteCpf: string, produtoId: string): Promise<void> {
    try {
      console.log('💔 Removendo favorito...');
      console.log('👤 Cliente CPF:', clienteCpf);
      console.log('🛍️ Produto ID:', produtoId);
      
      const response = await api.delete(`/clientes/${clienteCpf}/favoritos`, {
        data: { produto_id: produtoId }
      });
      
      console.log('✅ Favorito removido:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao remover favorito:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao remover favorito'
      );
    }
  }

  // Listar produtos favoritos (requer autenticação)
  async listarFavoritos(clienteCpf: string): Promise<Produto[]> {
    try {
      console.log('❤️ Listando favoritos do cliente:', clienteCpf);
      
      const response = await api.get(`/clientes/${clienteCpf}/favoritos`);
      
      console.log('✅ Favoritos encontrados:', response.data);
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Erro ao listar favoritos:', error);
      console.error('📋 Detalhes do erro:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao listar favoritos'
      );
    }
  }

  // Buscar perfil completo do cliente logado (usado na página de perfil)
  async buscarPerfilCompleto(cpf: string): Promise<{
    cliente: Cliente;
    favoritos: Produto[];
  }> {
    try {
      console.log('📋 Buscando perfil completo do cliente:', cpf);
      
      // Buscar dados do cliente e favoritos em paralelo
      const [clienteResponse, favoritosResponse] = await Promise.all([
        this.buscarPorCpf(cpf),
        this.listarFavoritos(cpf).catch(() => []) // Se falhar, retorna array vazio
      ]);
      
      const resultado = {
        cliente: clienteResponse,
        favoritos: favoritosResponse
      };
      
      console.log('✅ Perfil completo carregado:', {
        cliente: resultado.cliente.nome,
        totalFavoritos: resultado.favoritos.length
      });
      
      return resultado;
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil completo:', error);
      
      throw new Error(
        error.response?.data?.message || 
        'Erro ao carregar perfil'
      );
    }
  }
}

export default new ClienteService();