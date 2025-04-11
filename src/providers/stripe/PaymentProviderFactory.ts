import { PaymentProvider } from './PaymentProvider';
import { StripeProvider } from './StripeProvider';

/**
 * Factory para criar instâncias de PaymentProvider
 */
export class PaymentProviderFactory {
  private static instance: PaymentProvider;

  /**
   * Obtém uma instância do provider de pagamentos
   * Implementa o padrão Singleton para reutilizar a instância
   */
  static getProvider(): PaymentProvider {
    if (!PaymentProviderFactory.instance) {
      PaymentProviderFactory.instance = new StripeProvider();
    }
    return PaymentProviderFactory.instance;
  }
} 