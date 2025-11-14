// Máscaras comuns para formulários
export const masks = {
  phone: '(99) 99999-9999',
  cpf: '999.999.999-99',
  cnpj: '99.999.999/9999-99',
  cep: '99999-999',
  date: '99/99/9999',
  creditCard: '9999 9999 9999 9999',
  cvv: '999',
  money: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = (Number(numbers) / 100).toFixed(2);
    return `R$ ${formatted.replace('.', ',')}`;
  }
};

// Função para limpar máscara e retornar apenas números
export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Validação de CPF
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = removeMask(cpf);
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

// Validação de CNPJ
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = removeMask(cnpj);

  if (cleanCNPJ.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

  let length = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, length);
  const digits = cleanCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cleanCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
};

// Validação de telefone brasileiro
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = removeMask(phone);
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

// Validação de CEP
export const isValidCEP = (cep: string): boolean => {
  const cleanCEP = removeMask(cep);
  return cleanCEP.length === 8;
};
