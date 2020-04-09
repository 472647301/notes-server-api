import { Module, HttpModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersProviders } from './users.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
})
export class UsersModule {}
