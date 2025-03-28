const formatCurrency = (
    value: number,
    currency: string = 'BRL' // Valor padrão
  ): string => {
    return value.toLocaleString('pt-BR', { // PT-BR em maiúsculo conforme padrão
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  export default formatCurrency