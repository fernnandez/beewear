// Configurações da Stripe - Versão Simplificada
export const STRIPE_CONFIG = {
  // Chave pública da Stripe (teste)
  PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',

  // URLs de redirecionamento
  SUCCESS_URL: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  CANCEL_URL: `${window.location.origin}/checkout`,

  // Configurações de pagamento (apenas cartão por enquanto)
  PAYMENT_METHODS: ["card"],

  CURRENCY: "eur", // Euro para Portugal
  COUNTRY: "PT", // Portugal

  // Configurações de métodos de pagamento
  METHODS_CONFIG: {
    card: {
      id: "card",
      name: "Cartão de Crédito/Débito",
      description: "Visa, Mastercard, American Express e outros",
      icon: "💳",
      isActive: true,
      countries: ["global"],
    },
    // FUTURO: Adicionar outros métodos aqui
    // klarna: {
    //   id: 'klarna',
    //   name: 'Klarna',
    //   description: 'Pague em 4x sem juros ou em 30 dias',
    //   icon: '🛒',
    //   isActive: false, // false até ser ativado no dashboard
    //   countries: ['PT'],
    // },
  },
};

// Função para carregar a Stripe
export const loadStripeInstance = async () => {
  const { loadStripe } = await import("@stripe/stripe-js");
  return loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);
};

// Função para obter métodos de pagamento ativos
export const getActivePaymentMethods = () => {
  return Object.values(STRIPE_CONFIG.METHODS_CONFIG).filter(
    (method) => method.isActive
  );
};

// Função para verificar se um método está ativo
export const isPaymentMethodActive = (methodId: string): boolean => {
  const method =
    STRIPE_CONFIG.METHODS_CONFIG[
      methodId as keyof typeof STRIPE_CONFIG.METHODS_CONFIG
    ];
  return method?.isActive || false;
};
