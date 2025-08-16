import { Button, Alert, Text, Stack, Group, Badge } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { useStockValidation } from '@hooks/useStockValidation';
import { useCart } from '@contexts/cart-context';

export function StockValidationExample() {
  const { items } = useCart();
  const { validateStock, isValidating, validationResult, error, clearValidation } = useStockValidation();

  const handleValidateStock = async () => {
    try {
      const stockData = items.map(item => ({
        productVariationSizePublicId: item.productVariationSizePublicId,
        quantity: item.quantity,
      }));

      await validateStock(stockData);
    } catch (err) {
      console.error('Erro na validação:', err);
    }
  };

  const handleProceedToCheckout = () => {
    if (validationResult?.isValid) {
      // ✅ Estoque validado, pode prosseguir para checkout
      console.log('Estoque validado, redirecionando para checkout...');
      // Aqui você redirecionaria para o checkout da Stripe
    }
  };

  return (
    <Stack gap="md">
      <Button
        onClick={handleValidateStock}
        loading={isValidating}
        disabled={items.length === 0}
      >
        {isValidating ? 'Validando Estoque...' : 'Validar Estoque'}
      </Button>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Erro na Validação" color="red">
          <Text size="sm">{error}</Text>
        </Alert>
      )}

      {validationResult && (
        <Stack gap="md">
          <Alert
            icon={validationResult.isValid ? <IconCheck size={16} /> : <IconX size={16} />}
            title={validationResult.isValid ? 'Estoque Disponível' : 'Estoque Insuficiente'}
            color={validationResult.isValid ? 'green' : 'red'}
          >
            <Text size="sm">{validationResult.message}</Text>
            <Text size="sm" fw={600} mt="xs">
              Total: €{validationResult.totalAmount.toFixed(2)}
            </Text>
          </Alert>

          {/* Detalhes dos itens */}
          <Stack gap="sm">
            {validationResult.items.map((item, index) => (
              <Group key={index} justify="space-between" p="sm" style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}>
                <Stack gap={4}>
                  <Text fw={600} size="sm">{item.productName}</Text>
                  <Text size="xs" c="dimmed">
                    {item.variationName} - {item.size} ({item.color})
                  </Text>
                  <Text size="xs">
                    Solicitado: {item.requestedQuantity} | Disponível: {item.availableQuantity}
                  </Text>
                </Stack>
                <Badge color={item.isAvailable ? 'green' : 'red'} variant="light">
                  {item.isAvailable ? 'Disponível' : 'Indisponível'}
                </Badge>
              </Group>
            ))}
          </Stack>

          {/* Botão para prosseguir */}
          {validationResult.isValid && (
            <Button
              onClick={handleProceedToCheckout}
              color="green"
              fullWidth
            >
              ✅ Prosseguir para Checkout
            </Button>
          )}

          <Button
            onClick={clearValidation}
            variant="outline"
            size="sm"
          >
            Limpar Validação
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
