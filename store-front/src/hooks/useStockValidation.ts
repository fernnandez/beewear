import { useState } from 'react';
import orderService, { ValidateStockRequest, ValidateStockResponse } from '@services/order.service';

export function useStockValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidateStockResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateStock = async (items: Array<{ productVariationSizePublicId: string; quantity: number }>) => {
    try {
      setIsValidating(true);
      setError(null);

      const validateStockData: ValidateStockRequest = { items };
      const result = await orderService.validateStock(validateStockData);
      
      setValidationResult(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao validar estoque';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  const clearValidation = () => {
    setValidationResult(null);
    setError(null);
  };

  return {
    validateStock,
    clearValidation,
    isValidating,
    validationResult,
    error,
  };
}
