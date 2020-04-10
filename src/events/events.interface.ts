export interface EventAccount {
  token: string;
  type: 'sub' | 'unsub';
}

export interface EventEdit {
  token: string;
  type: 'sub' | 'unsub';
  id: string;
  members: string;
}
