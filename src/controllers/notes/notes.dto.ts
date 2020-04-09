import { IsString } from 'class-validator';

export class JwtPayload {
  @IsString()
  readonly email: string;

  @IsString()
  readonly nickname: string;
}

export class NotesCreate {
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
}

export class NotesUpdate {
  @IsString()
  readonly id: string;
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
}

export class NotesRemove {
  @IsString()
  readonly id: string;
}

export class NotesMember {
  @IsString()
  readonly id: string;
  @IsString()
  readonly email: string;
}
