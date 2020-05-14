import { HuntsService } from './hunts.service';
import { HuntsController } from './hunts.controller';
import { Module, HttpModule } from '@nestjs/common';
import { UsersProviders } from './hunts.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [HuntsController],
  providers: [HuntsService, ...UsersProviders],
})
export class UsersModule {}
