import { Module } from '@nestjs/common';
import { UsersModule } from './controllers/users/users.module';
import { NotesModule } from './controllers/notes/notes.module';
// import { EventsModule } from './events/events.module';
import { ValidationPipe } from './pipes';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [UsersModule, NotesModule /*EventsModule*/],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
