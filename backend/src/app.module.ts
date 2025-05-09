import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || '123',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forRoot(process.env.MONGO_URI||"mongodb+srv://admin:admin@restapi.lasdt.mongodb.net/Clothing?retryWrites=true&w=majority&appName=restAPI"),
    AuthModule,
    ItemsModule,
    UsersModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
