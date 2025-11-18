/**
 * Valida se um CPF é válido
 * @param cpf - CPF para validar (com ou sem formatação)
 * @returns true se válido, false se inválido
 */
export function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) {
    return false;
  }

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) {
    return false;
  }

  return true;
}

/**
 * Formata um CPF para o padrão XXX.XXX.XXX-XX
 * @param cpf - CPF sem formatação
 * @returns CPF formatado
 */
export function formatarCPF(cpf: string): string {
  const cpfLimpo = cpf.replace(/[^\d]/g, '');
  
  if (cpfLimpo.length !== 11) {
    return cpf;
  }

  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Remove formatação do CPF
 * @param cpf - CPF com formatação
 * @returns CPF apenas com números
 */
export function limparCPF(cpf: string): string {
  return cpf.replace(/[^\d]/g, '');
}

/**
 * Aplica máscara de CPF enquanto o usuário digita
 * @param value - Valor digitado
 * @returns Valor com máscara aplicada
 */
export function aplicarMascaraCPF(value: string): string {
  const cpfLimpo = value.replace(/[^\d]/g, '');
  
  if (cpfLimpo.length <= 3) {
    return cpfLimpo;
  } else if (cpfLimpo.length <= 6) {
    return cpfLimpo.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  } else if (cpfLimpo.length <= 9) {
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else {
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }
}
