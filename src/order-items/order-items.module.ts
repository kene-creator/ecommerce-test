import { Module } from '@nestjs/common';
import { OrderItemsController } from './order-items.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderItemsController],
})
export class OrderItemsModule {}
