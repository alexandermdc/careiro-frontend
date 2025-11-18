import { useState, useCallback } from 'react';
import { validarCPF, aplicarMascaraCPF, limparCPF } from '../utils/cpfValidator';

interface UseCPFInputReturn {
  cpf: string;
  cpfFormatado: string;
  cpfValido: boolean;
  erro: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  limpar: () => void;
  validar: () => boolean;
}

/**
 * @param initialValue 
 * @returns 
 */
export function useCPFInput(initialValue: string = ''): UseCPFInputReturn {
  const [cpf, setCpf] = useState(initialValue);
  const [erro, setErro] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const masked = aplicarMascaraCPF(value);
    
    // Limita a 14 caracteres (XXX.XXX.XXX-XX)
    if (masked.length <= 14) {
      setCpf(masked);
      setErro('');
    }
  }, []);

  const validar = useCallback((): boolean => {
    const cpfLimpo = limparCPF(cpf);
    
    if (!cpfLimpo) {
      setErro('CPF é obrigatório');
      return false;
    }

    if (cpfLimpo.length !== 11) {
      setErro('CPF deve ter 11 dígitos');
      return false;
    }

    if (!validarCPF(cpfLimpo)) {
      setErro('CPF inválido');
      return false;
    }

    setErro('');
    return true;
  }, [cpf]);

  const limpar = useCallback(() => {
    setCpf('');
    setErro('');
  }, []);

  return {
    cpf,
    cpfFormatado: cpf,
    cpfValido: validarCPF(limparCPF(cpf)),
    erro,
    handleChange,
    limpar,
    validar,
  };
}
