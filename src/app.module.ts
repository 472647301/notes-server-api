import { Module } from '@nestjs/common';
import { UsersModule } from './controllers/users/users.module';
import { NotesModule } from './controllers/notes/notes.module';
// import { EventsModule } from './events/events.module';
import { ValidationPipe } from './pipes';
import { APP_PIPE } from '@nestjs/core';
import { HuntsModule } from './controllers/hunts/hunts.module';

@Module({
  imports: [UsersModule, NotesModule /*EventsModule*/, HuntsModule],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
