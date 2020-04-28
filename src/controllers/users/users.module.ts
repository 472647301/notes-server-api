import { Module, HttpModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersProviders } from './users.providers';
import { NotesProviders } from '../notes/notes.providers';
import { DatabaseModule } from '../../database/database.module';
import { EventsGateway } from '../../events/events.gateway';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ...UsersProviders,
    ...NotesProviders,
    EventsGateway,
  ],
})
export class UsersModule {}
