/**
 * Configuração de métodos de pagamento forçados
 * Use este arquivo quando a configuração automática da Stripe não funcionar
 */

// Configuração para forçar métodos específicos
export const FORCE_PAYMENT_METHODS = {
  // Descomente e configure os métodos que deseja forçar
  // CARTÃO + KLARNA
  CARD_KLARNA: ['card', 'klarna'],
  
  // APENAS CARTÃO
  CARD_ONLY: ['card'],
  
  // APENAS KLARNA
  KLARNA_ONLY: ['klarna'],
  
  // CARTÃO + PAYPAL (se disponível)
  CARD_PAYPAL: ['card', 'paypal'],
  
  // TODOS OS MÉTODOS DISPONÍVEIS
  ALL_AVAILABLE: ['card', 'klarna', 'paypal', 'mbway'],
};

// Configuração padrão (deixe undefined para usar configuração automática da Stripe)
export const DEFAULT_FORCE_METHODS: string[] | undefined = undefined;

// Para forçar métodos específicos, altere para:
// export const DEFAULT_FORCE_METHODS = FORCE_PAYMENT_METHODS.CARD_KLARNA;

/**
 * Como usar:
 * 
 * 1. Para usar configuração automática da Stripe (recomendado):
 *    - Deixe DEFAULT_FORCE_METHODS como undefined
 * 
 * 2. Para forçar métodos específicos:
 *    - Altere DEFAULT_FORCE_METHODS para um dos valores acima
 *    - Exemplo: export const DEFAULT_FORCE_METHODS = FORCE_PAYMENT_METHODS.CARD_KLARNA;
 * 
 * 3. Para testar diferentes configurações:
 *    - Altere temporariamente e teste
 *    - Volte para undefined quando funcionar
 */

/**
 * Métodos disponíveis na Stripe para Portugal:
 * 
 * - 'card': Cartão de crédito/débito (Visa, Mastercard, American Express)
 * - 'klarna': Klarna (4x sem juros, pagamento em 30 dias)
 * - 'paypal': PayPal (se disponível para sua conta)
 * - 'mbway': MB WAY (se disponível para sua conta)
 * - 'apple_pay': Apple Pay (se disponível)
 * - 'google_pay': Google Pay (se disponível)
 * - 'ideal': iDEAL (pagamento bancário)
 * - 'sepa_debit': Débito SEPA
 */
