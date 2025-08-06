import { Address } from 'src/domain/user/address/address.entity';
import { IProcessor } from 'typeorm-fixtures-cli';

export default class AddressProcessor implements IProcessor<Address> {
  async preProcess(name: string, object: any): Promise<any> {
    const processed = { ...object };

    // Garantir que os campos obrigatórios tenham valores padrão
    if (!processed.country) {
      processed.country = 'Portugal';
    }

    if (processed.isDefault === undefined) {
      processed.isDefault = false;
    }

    // Garantir que complement seja string vazia se não fornecido
    if (processed.complement === undefined) {
      processed.complement = '';
    }

    return processed;
  }

  postProcess(name: string, object: { [key: string]: any }): void {
    // Log para debug se necessário
    console.log(`Address fixture processed: ${name}`);
  }
}
