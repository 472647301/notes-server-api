import { HuntsService } from './hunts.service';
import { HuntsController } from './hunts.controller';
import { Module, HttpModule } from '@nestjs/common';
import { HuntsProviders } from './hunts.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [HuntsController],
  providers: [HuntsService, ...HuntsProviders],
})
export class HuntsModule {}
