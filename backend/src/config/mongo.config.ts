import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const MongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  return {
    uri: configService.get<string>('MONGO_URI'),
    auth: {
      username: configService.get<string>('MONGO_USER'),
      password: configService.get<string>('MONGO_PASSWORD'),
    },
  };
};
