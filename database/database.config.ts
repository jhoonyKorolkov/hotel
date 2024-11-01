import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const mongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const user = configService.get<string>('MONGO_USER');
  const password = configService.get<string>('MONGO_PASSWORD');
  const host = configService.get<string>('MONGO_HOST');
  const port = configService.get<string>('MONGO_PORT');
  const database = configService.get<string>('MONGO_DB');

  const uri = `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=${user}`;

  return {
    uri,
  };
};
