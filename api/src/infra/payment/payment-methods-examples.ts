/**
 * Exemplos de métodos de pagamento para Portugal
 *
 * Este arquivo mostra como adicionar novos métodos de pagamento
 * ao sistema de forma simples e flexível.
 */

export const PAYMENT_METHODS_EXAMPLES = {
  // Métodos já implementados
  card: {
    id: 'card',
    name: 'Cartão de Crédito/Débito',
    description: 'Visa, Mastercard, American Express e outros cartões',
    icon: '💳',
    isActive: true,
    countries: ['PT'],
    stripeMethod: 'card',
    features: ['Pagamento imediato', 'Seguro pela Stripe', 'Suporte 24/7'],
    stripeOptions: {
      request_three_d_secure: 'automatic',
    },
  },

  klarna: {
    id: 'klarna',
    name: 'Klarna',
    description: 'Pague em 4x sem juros ou em 30 dias',
    icon: '🛒',
    isActive: true,
    countries: ['PT'],
    stripeMethod: 'klarna',
    features: ['4x sem juros', 'Pagamento em 30 dias', 'Sem cartão necessário'],
    stripeOptions: {
      payment_method_data: {
        billing_details: {
          address: {
            country: 'PT',
          },
        },
      },
    },
  },

  // Exemplos de novos métodos que podem ser adicionados

  paypal: {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pague com sua conta PayPal',
    icon: '🔵',
    isActive: false, // Desativado por padrão
    countries: ['PT'],
    stripeMethod: 'paypal',
    features: ['Pagamento seguro', 'Conta PayPal', 'Proteção ao comprador'],
    stripeOptions: {
      payment_method_data: {
        billing_details: {
          address: {
            country: 'PT',
          },
        },
      },
    },
  },

  mbway: {
    id: 'mbway',
    name: 'MB WAY',
    description: 'Pague com MB WAY através do seu smartphone',
    icon: '📱',
    isActive: false, // Desativado por padrão
    countries: ['PT'],
    stripeMethod: 'mbway',
    features: ['Pagamento móvel', 'App MB WAY', 'Pagamento instantâneo'],
    stripeOptions: {
      payment_method_data: {
        billing_details: {
          address: {
            country: 'PT',
          },
        },
      },
    },
  },

  apple_pay: {
    id: 'apple_pay',
    name: 'Apple Pay',
    description: 'Pague com Apple Pay no seu dispositivo Apple',
    icon: '🍎',
    isActive: false, // Desativado por padrão
    countries: ['PT'],
    stripeMethod: 'apple_pay',
    features: [
      'Pagamento com Face ID/Touch ID',
      'Seguro pela Apple',
      'Integração nativa',
    ],
    stripeOptions: {
      payment_method_data: {
        billing_details: {
          address: {
            country: 'PT',
          },
        },
      },
    },
  },

  google_pay: {
    id: 'google_pay',
    name: 'Google Pay',
    description: 'Pague com Google Pay no seu dispositivo Android',
    icon: '🤖',
    isActive: false, // Desativado por padrão
    countries: ['PT'],
    stripeMethod: 'google_pay',
    features: [
      'Pagamento com impressão digital',
      'Seguro pelo Google',
      'Integração Android',
    ],
    stripeOptions: {
      payment_method_data: {
        billing_details: {
          address: {
            country: 'PT',
          },
        },
      },
    },
  },

  ideal: {
    id: 'ideal',
    name: 'iDEAL',
    description: 'Pagamento bancário online holandês (disponível em Portugal)',
    icon: '🏦',
    isActive: false, // Desativado por padrão
    countries: ['PT', 'NL'],
    stripeMethod: 'ideal',
    features: ['Pagamento bancário', 'Transferência instantânea', 'Sem taxas'],
    stripeOptions: {
      payment_method_data: {
        billing_details: {
          address: {
            country: 'PT',
          },
        },
      },
    },
  },

  sepa_debit: {
    id: 'sepa_debit',
    name: 'Débito SEPA',
    description: 'Pagamento por débito direto bancário europeu',
    icon: '🇪🇺',
    isActive: false, // Desativado por padrão
    countries: ['PT', 'DE', 'FR', 'ES', 'IT'], // Países SEPA
    stripeMethod: 'sepa_debit',
    features: ['Pagamento bancário', 'Baixas taxas', 'Processamento em lote'],
    stripeOptions: {
      payment_method_data: {
        billing_details: {
          address: {
            country: 'PT',
          },
        },
      },
    },
  },
};

/**
 * Como usar:
 *
 * 1. Copie o método desejado para PAYMENT_METHODS_CONFIG em stripe.service.ts
 * 2. Copie o mesmo método para METHODS_CONFIG em store-front/src/utils/stripe.ts
 * 3. Altere isActive para true quando quiser ativar
 * 4. Teste o método no ambiente de desenvolvimento
 * 5. Ative em produção quando estiver funcionando
 *
 * Exemplo:
 *
 * // Em stripe.service.ts
 * private readonly PAYMENT_METHODS_CONFIG = {
 *   card: { ... },
 *   klarna: { ... },
 *   paypal: PAYMENT_METHODS_EXAMPLES.paypal, // Adicionar aqui
 * };
 *
 * // Em store-front/src/utils/stripe.ts
 * METHODS_CONFIG: {
 *   card: { ... },
 *   klarna: { ... },
 *   paypal: PAYMENT_METHODS_EXAMPLES.paypal, // Adicionar aqui
 * };
 */
