// Configuração SIMPLIFICADA da Stripe - A Stripe gerencia tudo automaticamente!
export const STRIPE_CONFIG = {
  // Chave pública da Stripe
  PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',

  // URLs de redirecionamento
  SUCCESS_URL: `${window.location.origin}/checkout/success`,
  CANCEL_URL: `${window.location.origin}/checkout`,

  // Configurações básicas para Portugal
  CURRENCY: "eur", // Euro para Portugal
  COUNTRY: "PT", // Portugal
  LOCALE: "pt", // Português
};

// Função para carregar a Stripe
export const loadStripeInstance = async () => {
  const { loadStripe } = await import("@stripe/stripe-js");
  return loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);
};