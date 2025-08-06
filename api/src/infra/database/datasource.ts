import { config } from 'src/config/database.config';
import { DataSource } from 'typeorm';

const extraConfig = {
  ...config,
  synchronize: true,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
};

const datasource = new DataSource(extraConfig);
export default datasource;
