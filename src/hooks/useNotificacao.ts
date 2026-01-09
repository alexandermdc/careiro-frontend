import { useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificacaoConfig {
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export const useNotificacao = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<NotificacaoConfig>({
    type: 'info',
    title: '',
    message: ''
  });

  const mostrar = useCallback((notificacao: NotificacaoConfig) => {
    setConfig(notificacao);
    setIsOpen(true);
  }, []);

  const fechar = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Atalhos para tipos específicos
  const sucesso = useCallback((message: string, title: string = 'Sucesso!') => {
    mostrar({
      type: 'success',
      title,
      message
    });
  }, [mostrar]);

  const erro = useCallback((message: string, title: string = 'Erro!') => {
    mostrar({
      type: 'error',
      title,
      message
    });
  }, [mostrar]);

  const aviso = useCallback((message: string, title: string = 'Atenção!') => {
    mostrar({
      type: 'warning',
      title,
      message
    });
  }, [mostrar]);

  const informacao = useCallback((message: string, title: string = 'Informação') => {
    mostrar({
      type: 'info',
      title,
      message
    });
  }, [mostrar]);

  return {
    isOpen,
    config,
    mostrar,
    fechar,
    sucesso,
    erro,
    aviso,
    informacao
  };
};
