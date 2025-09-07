import { Provider } from '@nestjs/common';
import { CloudinaryStorageInterface } from './cloudinary/cloudinary.interface';
import { LocalStorageInterface } from './local/local.interface';

export const STORAGE_PROVIDER: Provider = {
  provide: 'ImageStorageService',
  useFactory: (
    cloudinaryProvider: CloudinaryStorageInterface,
    localProvider: LocalStorageInterface,
  ): CloudinaryStorageInterface | LocalStorageInterface => {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      return cloudinaryProvider;
    } else {
      return localProvider;
    }
  },
  inject: ['CloudinaryStorageProvider', 'LocalStorageProvider'],
};
