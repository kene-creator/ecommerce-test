import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderItemsModule } from './order-items/order-items.module';
import { AccountModule } from './account/account.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { MongoClient } from 'mongodb';

@Module({
  imports: [OrderItemsModule, AccountModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    AuthGuard,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        const client = new MongoClient('mongodb://127.0.0.1:27017');
        await client.connect();
        return client.db('ecommerce');
      },
    },
  ],
})
export class AppModule {}
