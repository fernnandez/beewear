import * as bcrypt from 'bcrypt';
import { User } from 'src/domain/user/user.entity';
import { IProcessor } from 'typeorm-fixtures-cli';

export default class UserProcessor implements IProcessor<User> {
  async preProcess(name: string, object: any): Promise<any> {
    const processed = { ...object };

    if (processed.password) {
      const salt = await bcrypt.genSalt(10);
      processed.password = await bcrypt.hash(processed.password, salt);
    }

    return processed;
  }

  postProcess(name: string, object: { [key: string]: any }): void {
    if (object.firstName && object.lastName) {
      object.name = `${object.firstName} ${object.lastName}`;
    }
  }
}
