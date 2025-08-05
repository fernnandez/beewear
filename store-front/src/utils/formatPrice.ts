/**
 * Formata um preço para exibição no formato português
 * @param price - O preço a ser formatado (pode ser string, number ou undefined)
 * @returns String formatada do preço
 */
export const formatPrice = (price: string | number | undefined | null): string => {
  if (price === undefined || price === null) {
    return "€0,00";
  }
  
  const numericPrice = Number(price);
  
  if (isNaN(numericPrice)) {
    return "€0,00";
  }
  
  return `€${numericPrice.toFixed(2).replace(".", ",")}`;
}; 