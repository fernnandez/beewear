import orderService from "@services/order.service";
import { IconCheck, IconPackage, IconTruck, IconX } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCart } from "../contexts/cart-context";
import { getOrderStatusInfo } from "../utils/status-mapper";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.findUserOrders(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useOrder = (publicId: string) => {
  return useQuery({
    queryKey: ["order", publicId],
    queryFn: () => orderService.findOrderByPublicId(publicId),
    enabled: !!publicId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};


// Hook para confirmação de pedidos após checkout
export const useOrderConfirmation = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationError, setConfirmationError] = useState<string | null>(
    null
  );
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const queryClient = useQueryClient();
  const { clearCart } = useCart();

  const confirmOrderAfterCheckout = async (
    orderId: string,
    sessionId: string
  ) => {
    console.log("📞 confirmOrderAfterCheckout chamado com:", {
      orderId,
      sessionId,
    });

    if (!sessionId) {
      console.log("❌ sessionId ausente");
      return { success: false, error: "Session ID ausente" };
    }

    try {
      setIsConfirming(true);
      setConfirmationError(null);

      console.log("📡 Chamando orderService.confirmOrder...");
      const confirmedOrder = await orderService.confirmOrder(
        orderId,
        sessionId
      );
      console.log("✅ Resposta do orderService:", confirmedOrder);

      if (confirmedOrder && confirmedOrder.status === "CONFIRMED") {
        setOrderConfirmed(true);
        console.log("🎉 Pedido confirmado com sucesso!");

        // Limpar o carrinho após confirmação bem-sucedida
        clearCart();
        console.log("🛒 Carrinho limpo com sucesso!");

        // Invalidar queries relacionadas para atualizar a UI
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });

        return { success: true, order: confirmedOrder };
      } else {
        const errorMsg =
          "Pedido não foi confirmado. Status: " +
          (confirmedOrder?.status || "desconhecido");
        console.log("⚠️ " + errorMsg);
        setConfirmationError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("❌ Erro ao confirmar pedido:", error);
      const errorMsg =
        "Erro ao confirmar pedido. Entre em contato com o suporte.";
      setConfirmationError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsConfirming(false);
    }
  };

  const checkOrderStatus = async (orderId: string) => {
    if (!orderId) return { success: false, error: "Order ID ausente" };

    try {
      setIsConfirming(true);
      setConfirmationError(null);

      console.log("📡 Verificando status do pedido diretamente...");
      const order = await orderService.findOrderByPublicId(orderId);
      console.log("✅ Status atual do pedido:", order.status);

      if (order.status === "CONFIRMED") {
        setOrderConfirmed(true);
        console.log("🎉 Pedido já estava confirmado!");
        return { success: true, order, alreadyConfirmed: true };
      } else if (order.status === "PENDING") {
        console.log("⏳ Pedido ainda pendente, aguardando confirmação...");
        const errorMsg =
          "Pedido ainda está pendente. A confirmação pode levar alguns minutos.";
        setConfirmationError(errorMsg);
        return { success: false, error: errorMsg, order };
      } else {
        console.log("⚠️ Status inesperado:", order.status);
        const errorMsg = `Status inesperado do pedido: ${order.status}`;
        setConfirmationError(errorMsg);
        return { success: false, error: errorMsg, order };
      }
    } catch (error) {
      console.error("❌ Erro ao verificar status do pedido:", error);
      const errorMsg =
        "Erro ao verificar status do pedido. Entre em contato com o suporte.";
      setConfirmationError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsConfirming(false);
    }
  };

  const resetConfirmationState = () => {
    setConfirmationError(null);
    setOrderConfirmed(false);
  };

  return {
    isConfirming,
    confirmationError,
    orderConfirmed,
    confirmOrderAfterCheckout,
    checkOrderStatus,
    resetConfirmationState,
  };
};


export const getStatusColor = (status: string) => {
  return getOrderStatusInfo(status).color;
};

export const getStatusText = (status: string) => {
  return getOrderStatusInfo(status).label;
};

export const getStatusIcon = (status: string) => {
  const statusIcons: Record<string, React.ElementType> = {
    PENDING: IconPackage,
    CONFIRMED: IconCheck,
    SHIPPED: IconTruck,
    DELIVERED: IconCheck,
    CANCELLED: IconX,
  };
  return statusIcons[status] || IconPackage;
};

export const getPaymentMethodText = (method: string) => {
  const methodTexts: Record<string, string> = {
    card: "Cartão de Crédito/Débito",
    klarna: "Klarna",
    mbway: "MB WAY",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
    ideal: "iDEAL",
    sepa_debit: "Débito SEPA",
    sofort: "SOFORT",
    bancontact: "Bancontact",
    eps: "EPS",
    giropay: "GiroPay",
    przelewy24: "Przelewy24",
  };

  // Se não encontrar no mapeamento, capitalizar e formatar o método
  if (!method) {
    return "Método de pagamento";
  }

  return (
    methodTexts[method] ||
    method.charAt(0).toUpperCase() + method.slice(1).replace(/_/g, " ")
  );
};

export const getPaymentMethodIcon = (method: string) => {
  if (!method) {
    return "💳";
  }

  const methodIcons: Record<string, string> = {
    card: "💳",
    klarna: "🛒",
    mbway: "📱",
    apple_pay: "🍎",
    google_pay: "🤖",
    ideal: "🏦",
    sepa_debit: "🇪🇺",
    sofort: "🇩🇪",
    bancontact: "🇧🇪",
    eps: "🇦🇹",
    giropay: "🇩🇪",
    przelewy24: "🇵🇱",
    CREDIT_CARD: "💳",
    PIX: "📱",
    BANK_TRANSFER: "🏦",
  };

  return methodIcons[method] || "💳";
};

export const getPaymentMethodDescription = (method: string) => {
  if (!method) {
    return "Método de pagamento";
  }

  const methodDescriptions: Record<string, string> = {
    card: "Pagamento com cartão de crédito ou débito",
    klarna: "Pague em 4x sem juros ou em 30 dias",
    mbway: "Pagamento móvel através do MB WAY",
    apple_pay: "Pagamento com Apple Pay",
    google_pay: "Pagamento com Google Pay",
    ideal: "Pagamento bancário online",
    sepa_debit: "Débito direto bancário europeu",
    sofort: "Pagamento bancário online alemão",
    bancontact: "Pagamento bancário belga",
    eps: "Pagamento bancário austríaco",
    giropay: "Pagamento bancário alemão",
    przelewy24: "Pagamento bancário polonês",
  };

  return methodDescriptions[method] || "Método de pagamento";
};
