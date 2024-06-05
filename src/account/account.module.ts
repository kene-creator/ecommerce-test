import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountController],
})
export class AccountModule {}
