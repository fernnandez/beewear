import { useAuth } from "@contexts/auth-context";
import { useCart } from "@contexts/cart-context";
import { useCheckout } from "@contexts/checkout-context";
import { useStockValidation } from "@hooks/useStockValidation";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  rem,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import paymentService, {
  CreateCheckoutSessionDto,
} from "@services/payment.service";
import {
  IconAlertCircle,
  IconCheck,
  IconMinus,
  IconPlus,
  IconShoppingBagCheck,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { formatPrice } from "@utils/formatPrice";
import { loadStripeInstance, STRIPE_CONFIG } from "@utils/stripe";
import { useState, useEffect } from "react";

interface OrderSummaryProps {
  isCheckoutComplete: boolean;
  selectedPaymentMethod?: string;
}

export function OrderSummary({
  isCheckoutComplete,
  selectedPaymentMethod,
}: OrderSummaryProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();
  const { items, getTotalPrice, updateQuantity, removeItem } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

    // ✅ Hook para validação de estoque
  const { validateStock, isValidating, validationResult } =
    useStockValidation();
  
  // ✅ Hook para checkout com formatação de endereço
  const { formatAddressToString } = useCheckout();

  // ✅ Validar estoque uma única vez ao renderizar a página
  useEffect(() => {
    if (items.length > 0) {
      const stockData = items.map(item => ({
        productVariationSizePublicId: item.productVariationSizePublicId,
        quantity: item.quantity,
      }));
      
      validateStock(stockData).catch(console.error);
    }
  }, []); // Array vazio = executa apenas uma vez na montagem



  const handleConfirmOrder = async () => {
    try {
      setIsProcessing(true);

      // ✅ PRIMEIRO: Validar estoque antes de prosseguir
      if (!validationResult?.isValid) {
        throw new Error(
          "Alguns produtos não possuem estoque suficiente. Verifique a disponibilidade dos itens."
        );
      }

      

      // ✅ Formatar endereço para metadata
      const addressString = formatAddressToString();
      
      // Preparar dados para a sessão de checkout da Stripe
      const checkoutData: CreateCheckoutSessionDto = {
        items: items.map((item) => ({
          name: item.name,
          productVariationSizePublicId: item.productVariationSizePublicId,
          price: item.price,
          quantity: item.quantity,
          images: item.image ? [item.image] : [],
        })),
        successUrl: STRIPE_CONFIG.SUCCESS_URL,
        cancelUrl: STRIPE_CONFIG.CANCEL_URL,
        customerEmail: user.email,
        shippingAddress: addressString,
      };

      // ✅ Log do endereço formatado para debug
      console.log("Endereço formatado:", addressString);

      // Debug: mostrar método de pagamento selecionado
      console.log("Método de pagamento selecionado:", selectedPaymentMethod);
      console.log("Dados do checkout:", checkoutData);

      // Criar sessão de checkout
      const session = await paymentService.createCheckoutSession(checkoutData);

      // Carregar Stripe e redirecionar para checkout
      const stripe = await loadStripeInstance();

      if (!stripe) {
        throw new Error("Erro ao carregar Stripe");
      }

      // Redirecionar para a página de checkout da Stripe
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Erro ao processar checkout:", error);
      modals.openConfirmModal({
        centered: true,
        title: "Erro no Checkout",
        children: `Ocorreu um erro ao processar seu pedido: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
        labels: { confirm: "OK", cancel: "Cancelar" },
        confirmProps: { color: "red" },
        onConfirm: () => {},
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuantityChange = (
    productVariationSizePublicId: string,
    newQuantity: number
  ) => {
    updateQuantity(productVariationSizePublicId, newQuantity);
  };

  const handleRemoveItem = (
    productVariationSizePublicId: string,
    itemName: string
  ) => {
    modals.openConfirmModal({
      centered: true,
      title: "Remover item",
      children: `Tem certeza que deseja remover "${itemName}" do pedido?`,
      labels: { confirm: "Sim, remover", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      cancelProps: { variant: "outline" },
      onConfirm: () => {
        removeItem(productVariationSizePublicId);
      },
    });
  };

  return (
    <Stack gap="lg" pos="relative">
      <LoadingOverlay visible={isProcessing} />

      <Title order={2} fw={700} size={rem(24)}>
        Resumo do Pedido
      </Title>

      {/* ✅ Botão para Validar Estoque */}
      {items.length > 0 && (
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            Verificar disponibilidade dos produtos
          </Text>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              const stockData = items.map((item) => ({
                productVariationSizePublicId: item.productVariationSizePublicId,
                quantity: item.quantity,
              }));
              validateStock(stockData).catch(console.error);
            }}
            loading={isValidating}
            disabled={isValidating}
          >
            {isValidating ? "Verificando..." : "Validar Estoque"}
          </Button>
        </Group>
      )}

      {/* ✅ Status de Validação de Estoque */}
      {items.length > 0 && (
        <Alert
          icon={
            isValidating 
              ? undefined 
              : !validationResult 
                ? <IconAlertCircle size={16} />
                : validationResult.isValid 
                  ? <IconCheck size={16} /> 
                  : <IconX size={16} />
          }
          title={
            isValidating 
              ? "Verificando estoque..." 
              : !validationResult 
                ? "Estoque não verificado"
                : validationResult.isValid 
                  ? "Estoque disponível" 
                  : "Problemas de estoque"
          }
          color={
            isValidating 
              ? "blue" 
              : !validationResult 
                ? "yellow"
                : validationResult.isValid 
                  ? "green" 
                  : "red"
          }
          variant="light"
        >
          {isValidating ? (
            "Aguardando verificação de disponibilidade..."
          ) : !validationResult ? (
            "Clique em 'Validar Estoque' para verificar a disponibilidade dos produtos."
          ) : validationResult.isValid ? (
            `Todos os itens estão disponíveis`
          ) : (
            "Alguns itens não possuem estoque suficiente. Verifique a disponibilidade antes de prosseguir."
          )}
        </Alert>
      )}

      {/* Items */}
      {items.length === 0 ? (
        <Text ta="center" c="dimmed" py="xl">
          Nenhum item no carrinho
        </Text>
      ) : (
        <>
          <Stack gap="md">
            {items.map((item) => (
              <Paper
                key={item.productVariationSizePublicId}
                p="sm"
                style={{
                  border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
                  borderRadius: rem(8),
                  backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
                }}
              >
                <Stack gap="sm">
                  <Group align="start" wrap="nowrap">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      w={{ base: 80, sm: 100 }}
                      h={{ base: 80, sm: 100 }}
                      radius="sm"
                      style={{ objectFit: "cover", flexShrink: 0 }}
                    />

                    <Stack gap={6} style={{ flex: 1 }}>
                      <Text fw={600} size="sm" lineClamp={1}>
                        {item.name}
                      </Text>
                      <Group gap={"xs"}>
                        <Box
                          key={item.color}
                          w={20}
                          h={20}
                          style={{
                            backgroundColor: item.color,
                            borderRadius: "50%",
                          }}
                        />
                        <Badge
                          size="sm"
                          color={isDark ? "white" : "dark"}
                          variant="outline"
                        >
                          {item.size}
                        </Badge>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {formatPrice(item.price)}
                      </Text>

                      {/* ✅ Status de Estoque do Item */}
                      {validationResult && (
                        <Group gap="xs" align="center">
                          {(() => {
                            const stockItem = validationResult.items.find(
                              (stock) =>
                                stock.productVariationSizePublicId ===
                                item.productVariationSizePublicId
                            );

                            if (!stockItem) return null;

                            return (
                              <>
                                <Badge
                                  size="xs"
                                  color={
                                    stockItem.isAvailable ? "green" : "red"
                                  }
                                  variant="light"
                                >
                                  {stockItem.isAvailable
                                    ? "Disponível"
                                    : "Indisponível"}
                                </Badge>
                                <Text size="xs" c="dimmed">
                                  {stockItem.requestedQuantity} de{" "}
                                  {stockItem.availableQuantity} em estoque
                                </Text>
                              </>
                            );
                          })()}
                        </Group>
                      )}

                      <Group gap="xs">
                        <ActionIcon
                          size="xs"
                          variant="light"
                          onClick={() =>
                            handleQuantityChange(
                              item.productVariationSizePublicId,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <IconMinus size={14} />
                        </ActionIcon>
                        <Text size="sm" fw={500} w={20} ta="center">
                          {item.quantity}
                        </Text>
                        <ActionIcon
                          size="xs"
                          variant="light"
                          onClick={() =>
                            handleQuantityChange(
                              item.productVariationSizePublicId,
                              item.quantity + 1
                            )
                          }
                        >
                          <IconPlus size={18} />
                        </ActionIcon>
                      </Group>
                    </Stack>

                    <Stack align="flex-end" justify="space-between" h="100%">
                      <Text fw={600} size="sm">
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="red"
                        onClick={() =>
                          handleRemoveItem(
                            item.productVariationSizePublicId,
                            item.name
                          )
                        }
                        title="Remover"
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Stack>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Divider />
        </>
      )}

      {/* Total */}
      <Group justify="space-between">
        <Text size="md" fw={600}>
          Total:
        </Text>
        <Text size="lg" fw={700}>
          {formatPrice(getTotalPrice())}
        </Text>
      </Group>

      {/* Finalize Button */}
      <Button
        leftSection={<IconShoppingBagCheck size={16} />}
        size="md"
        color="dark"
        fullWidth
        onClick={handleConfirmOrder}
        style={{ marginTop: rem(16) }}
                disabled={
          items.length === 0 || 
          !isCheckoutComplete || 
          isProcessing || 
          isValidating || 
          !validationResult || 
          !validationResult.isValid
        }
        loading={isProcessing || isValidating}
      >
        {isProcessing
          ? "Processando..."
          : isValidating
          ? "Verificando estoque..."
          : !validationResult
          ? "Validar estoque primeiro"
          : !validationResult.isValid
          ? "Estoque insuficiente"
          : "Finalizar Compra"}
      </Button>
    </Stack>
  );
}
