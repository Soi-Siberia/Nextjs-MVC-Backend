import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Use async factory to get the MongoDB URI from the ConfigService
      // This allows you to use environment variables or other configuration methods
      // to set the MongoDB connection string.
      // The `uri` property is set to the value of the `MONGO_URI`
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    UsersModule,

  ],

  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
