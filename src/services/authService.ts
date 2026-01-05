import api from './api';
import logger from '../utils/logger';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipo de usuário retornado pelo backend
export type UserType = 'CLIENTE' | 'VENDEDOR' | 'ADMIN';

export interface Cliente {
  id_cliente: string;
  cpf: string;
  nome: string;
  telefone: string;
}

export interface Vendedor {
  id_vendedor: string;
  nome: string;
  telefone: string;
  endereco_venda: string;
  tipo_vendedor: 'PF' | 'PJ';
  tipo_documento: 'CPF' | 'CNPJ';
  numero_documento: string;
  fk_associacao?: string;
  associacao?: {
    id_associacao: string;
    nome: string;
  } | null;
}

export interface Usuario {
  id_usuario: string;
  email: string;
  papeis: UserType[];
  cliente?: Cliente;
  vendedor?: Vendedor;
}

export interface AuthResponse {
  token?: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  usuario: Usuario;
}

export interface User {
  nome: string;
  email: string;
  cpf?: string;
  id_vendedor?: string;
  tipo: UserType;
}

class AuthService {
  /**
   * Login unificado - funciona para Cliente, Vendedor e Admin
   * O backend detecta automaticamente o tipo de usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Tentando login com:', { email: credentials.email });
      
      const response = await api.post('/auth/login', {
        email: credentials.email,
        senha: credentials.password
      });
      
      console.log('📦 Resposta do backend:', response.data);
      
      const { token, accessToken, refreshToken, usuario, cliente, vendedor, tipo, papel, is_admin, admin } = response.data;
      
      // Usar 'token' ou 'accessToken'
      const finalToken = token || accessToken;
      
      // Construir objeto usuario se o backend retornou 'cliente' ou 'vendedor' diretamente
      let usuarioFinal = usuario;
      
      if (!usuarioFinal && (cliente || vendedor)) {
        console.log('🔄 Backend retornou cliente/vendedor diretamente, construindo objeto usuario...');
        
        // Extrair email do cliente ou criar um genérico
        const emailUsuario = credentials.email;
        
        // Determinar papéis baseado no que foi retornado
        const papeis: UserType[] = [];
        
        // Verificar se é ADMIN através de vários campos possíveis
        const isAdmin = 
          tipo === 'ADMIN' || 
          papel === 'ADMIN' || 
          is_admin === true || 
          admin === true ||
          cliente?.tipo === 'ADMIN' ||
          cliente?.papel === 'ADMIN' ||
          cliente?.is_admin === true ||
          // Verificar se o email é admin (fallback)
          emailUsuario.toLowerCase().includes('admin');
        
        if (isAdmin) {
          console.log('🛡️ ADMIN detectado através de verificação especial!');
          papeis.push('ADMIN');
        }
        
        if (cliente) papeis.push('CLIENTE');
        if (vendedor) papeis.push('VENDEDOR');
        
        usuarioFinal = {
          id_usuario: cliente?.id_cliente || vendedor?.id_vendedor || '',
          email: emailUsuario,
          papeis,
          cliente,
          vendedor
        };
        
        console.log('✅ Objeto usuario construído com papéis:', papeis);
      }
      
      // Se o backend retornou usuario mas também retornou cliente/vendedor separadamente,
      // mesclar os dados para garantir que temos tudo
      if (usuarioFinal && (cliente || vendedor)) {
        if (cliente && !usuarioFinal.cliente) {
          usuarioFinal.cliente = cliente;
          if (!usuarioFinal.papeis.includes('CLIENTE')) {
            usuarioFinal.papeis.push('CLIENTE');
          }
        }
        if (vendedor && !usuarioFinal.vendedor) {
          usuarioFinal.vendedor = vendedor;
          if (!usuarioFinal.papeis.includes('VENDEDOR')) {
            usuarioFinal.papeis.push('VENDEDOR');
          }
        }
        console.log('✅ Objeto usuario mesclado. Papéis finais:', usuarioFinal.papeis);
      }
      
      // Verificação adicional: se o email contém 'admin' mas não tem papel ADMIN, adicionar
      if (usuarioFinal && usuarioFinal.email.toLowerCase().includes('admin')) {
        if (!usuarioFinal.papeis.includes('ADMIN')) {
          console.log('🛡️ Email contém "admin" - adicionando papel ADMIN');
          usuarioFinal.papeis.unshift('ADMIN'); // Adiciona no início
        }
      }
      
      if (!usuarioFinal) {
        console.error('❌ Backend não retornou objeto usuario nem cliente/vendedor:', response.data);
        throw new Error('Resposta de login inválida - usuario não encontrado');
      }
      
      if (!usuarioFinal.papeis || usuarioFinal.papeis.length === 0) {
        console.error('❌ Backend não retornou papeis do usuario:', usuarioFinal);
        throw new Error('Resposta de login inválida - papeis não encontrados');
      }
      
      // Salvar tokens e dados do usuário
      localStorage.setItem('accessToken', finalToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('usuario', JSON.stringify(usuarioFinal));
      
      console.log('📋 Papéis do usuário:', usuarioFinal.papeis);
      
      // Papel padrão: ADMIN tem prioridade máxima
      const ultimoPapelUsado = localStorage.getItem('ultimoPapelUsado') as UserType | null;
      let papelPadrao: UserType;
      
      if (usuarioFinal.papeis.includes('ADMIN')) {
        // Se for ADMIN, usar ADMIN como padrão
        papelPadrao = 'ADMIN';
        console.log('✅ Detectado papel ADMIN - usando como padrão');
      } else if (ultimoPapelUsado && usuarioFinal.papeis.includes(ultimoPapelUsado)) {
        // Se o usuário já usou o sistema antes e ainda tem esse papel, manter
        papelPadrao = ultimoPapelUsado;
        console.log('✅ Usando último papel:', ultimoPapelUsado);
      } else {
        // Caso contrário, usar o primeiro papel da lista
        papelPadrao = usuarioFinal.papeis[0];
        console.log('✅ Usando primeiro papel da lista:', papelPadrao);
      }
      
      localStorage.setItem('papelAtivo', papelPadrao);
      localStorage.setItem('ultimoPapelUsado', papelPadrao);
      console.log('🎯 Papel ativo definido como:', papelPadrao);
      
      const papeisStr = usuarioFinal.papeis.join(', ');
      logger.success(`Login realizado com sucesso. Papéis: ${papeisStr}`);
      console.log('✅ Login concluído. Papel ativo:', papelPadrao);
      
      // Retornar com o objeto usuario normalizado
      return {
        token: finalToken,
        accessToken: finalToken,
        refreshToken,
        expiresIn: response.data.expiresIn || '1h',
        usuario: usuarioFinal
      };
    } catch (error: any) {
      console.error('❌ Erro completo no login:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      logger.error('Erro ao fazer login', error);
      
      // Mensagem de erro mais específica
      if (error.response?.status === 401) {
        throw new Error('Email ou senha incorretos');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Erro no login'
      );
    }
  }

  /**
   * Login específico para VENDEDOR
   * Sempre retorna papel VENDEDOR para evitar conflitos
   */
  async loginAsVendedor(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🏪 Login como VENDEDOR com:', { email: credentials.email });
      
      // Tenta endpoint específico de vendedor (se existir no backend)
      let response;
      try {
        response = await api.post('/auth/login/vendedor', {
          email: credentials.email,
          senha: credentials.password
        });
        console.log('✅ Endpoint específico /auth/login/vendedor usado');
      } catch (error: any) {
        // Se não existir, usa endpoint padrão
        if (error.response?.status === 404) {
          console.log('⚠️ Endpoint /auth/login/vendedor não existe, usando /auth/login');
          response = await api.post('/auth/login', {
            email: credentials.email,
            senha: credentials.password
          });
        } else {
          throw error;
        }
      }
      
      console.log('📦 Resposta do backend (vendedor):', response.data);
      
      const { token, accessToken, refreshToken, cliente } = response.data;
      const finalToken = token || accessToken;
      let { vendedor } = response.data;
      
      // SOLUÇÃO TEMPORÁRIA: Se não retornou vendedor, tentar buscar
      if (!vendedor && cliente) {
        console.log('⚠️ Backend não retornou vendedor, tentando buscar...');
        try {
          // Buscar vendedor pelo email
          const vendedoresResponse = await api.get('/vendedor');
          const vendedores = Array.isArray(vendedoresResponse.data) ? vendedoresResponse.data : [];
          vendedor = vendedores.find((v: any) => v.email === credentials.email);
          
          if (vendedor) {
            console.log('✅ Vendedor encontrado via busca:', vendedor);
          }
        } catch (err) {
          console.warn('⚠️ Não foi possível buscar dados de vendedor:', err);
        }
      }
      
      // Se ainda não tem vendedor, mostrar erro apropriado
      if (!vendedor) {
        if (cliente) {
          throw new Error('Este email está cadastrado APENAS como CLIENTE. Use o login de cliente em /login ou cadastre-se como vendedor.');
        }
        throw new Error('Credenciais inválidas ou usuário não encontrado como vendedor');
      }
      
      console.log('✅ Vendedor encontrado:', vendedor);
      if (cliente) {
        console.log('ℹ️ Usuário também é cliente, mas usando apenas perfil de vendedor');
      }
      
      // Construir objeto usuario SEMPRE como VENDEDOR
      const usuarioFinal = {
        id_usuario: vendedor.id_vendedor,
        email: credentials.email,
        papeis: ['VENDEDOR'] as UserType[],
        vendedor
      };
      
      // Salvar tokens e dados
      localStorage.setItem('accessToken', finalToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('usuario', JSON.stringify(usuarioFinal));
      localStorage.setItem('papelAtivo', 'VENDEDOR');
      localStorage.setItem('ultimoPapelUsado', 'VENDEDOR');
      
      console.log('✅ Login de vendedor concluído');
      logger.success('Login como vendedor realizado com sucesso');
      
      return {
        token: finalToken,
        accessToken: finalToken,
        refreshToken,
        expiresIn: response.data.expiresIn || '1h',
        usuario: usuarioFinal
      };
    } catch (error: any) {
      console.error('❌ Erro no login de vendedor:', error);
      logger.error('Erro ao fazer login como vendedor', error);
      
      if (error.response?.status === 401) {
        throw new Error('Email ou senha incorretos');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message ||
        'Erro no login de vendedor'
      );
    }
  }

  /**
   * @deprecated Use loginAsVendedor() ao invés disso
   */
  async loginVendedor(credentials: { id_vendedor: string; password: string }): Promise<AuthResponse> {
    return this.loginAsVendedor({
      email: credentials.id_vendedor,
      password: credentials.password
    });
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/refresh/logout', { refreshToken });
      }
      logger.info('Logout realizado');
    } catch (error) {
      logger.warn('Erro ao fazer logout no servidor', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('usuario');
      localStorage.removeItem('papelAtivo');
      // Mantém ultimoPapelUsado para lembrar a preferência do usuário no próximo login
      // localStorage.removeItem('ultimoPapelUsado');
      window.location.href = '/login';
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('usuario');
    return !!(token && user);
  }

  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUserType(): UserType | null {
    return this.getPapelAtivo();
  }

  getPapelAtivo(): UserType | null {
    const papel = localStorage.getItem('papelAtivo');
    return papel as UserType | null;
  }

  setPapelAtivo(papel: UserType): void {
    const usuario = this.getCurrentUser();
    if (usuario && usuario.papeis.includes(papel)) {
      localStorage.setItem('papelAtivo', papel);
      localStorage.setItem('ultimoPapelUsado', papel);
      console.log('✅ Papel ativo alterado para:', papel);
    }
  }

  getPapeis(): UserType[] {
    const usuario = this.getCurrentUser();
    return usuario?.papeis || [];
  }

  isVendedor(): boolean {
    const papelAtivo = this.getPapelAtivo();
    return papelAtivo === 'VENDEDOR';
  }

  temPapelVendedor(): boolean {
    const usuario = this.getCurrentUser();
    return usuario?.papeis.includes('VENDEDOR') || false;
  }

  isCliente(): boolean {
    const papelAtivo = this.getPapelAtivo();
    return papelAtivo === 'CLIENTE';
  }

  temPapelCliente(): boolean {
    const usuario = this.getCurrentUser();
    return usuario?.papeis.includes('CLIENTE') || false;
  }

  isAdmin(): boolean {
    const papelAtivo = this.getPapelAtivo();
    return papelAtivo === 'ADMIN';
  }

  temPapelAdmin(): boolean {
    const usuario = this.getCurrentUser();
    return usuario?.papeis.includes('ADMIN') || false;
  }
}

export default new AuthService();
