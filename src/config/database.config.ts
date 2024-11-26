import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const mongoConfig = async (configService: ConfigService): Promise<MongooseModuleOptions> => {
  const uri = configService.get<string>('MONGO_URI');
  return {
    uri,
  };
};
