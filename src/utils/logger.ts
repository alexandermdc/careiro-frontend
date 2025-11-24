/**
 * Utilitário de logging seguro
 * Logs são desabilitados em produção para evitar vazamento de dados sensíveis
 */

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  /**
   * Log de informação (apenas em desenvolvimento)
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.log('ℹ️', ...args);
    }
  },

  /**
   * Log de aviso (apenas em desenvolvimento)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('⚠️', ...args);
    }
  },

  /**
   * Log de erro (sempre exibe mensagem genérica em produção)
   */
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error('❌', message, error);
    } else {
      // Em produção, apenas mensagem genérica (sem detalhes sensíveis)
      console.error('❌', message);
    }
  },

  /**
   * Log de sucesso (apenas em desenvolvimento)
   */
  success: (...args: any[]) => {
    if (isDevelopment) {
      console.log('✅', ...args);
    }
  },

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug('🔍', ...args);
    }
  }
};

export default logger;
