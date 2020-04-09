import { Module, HttpModule } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesProviders } from './notes.providers';
import { UsersProviders } from '../users/users.providers';
import { DatabaseModule } from '../../database/database.module';
import { EventsGateway } from '../../events/events.gateway';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [NotesController],
  providers: [
    NotesService,
    ...UsersProviders,
    ...NotesProviders,
    EventsGateway,
  ],
})
export class NotesModule {}
