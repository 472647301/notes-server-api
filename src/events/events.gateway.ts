import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import * as WebSocket from 'ws';
import {
  responseFailure,
  responseSuccess,
  WS_NOTES_UPDATE,
  WS_NOTES_ROMOVE,
  WS_NOTES_MEMBER_ADD,
  WS_NOTES_MEMBER_DELETE,
} from '../config';
import * as jwt from 'jsonwebtoken';
import * as app from '../../package.json';
import { JwtPayload } from '../controllers/users/users.dto';
import { EventAccount, EventEdit } from './events.interface';

@WebSocketGateway({
  path: '/websocket',
  origins: '*:*',
  transports: ['websocket'],
})
export class EventsGateway {
  @WebSocketServer()
  server: WebSocket.Server;

  /**
   * 用户信息推送
   */
  @SubscribeMessage('account')
  accountEvent(
    @MessageBody() data: EventAccount,
    @ConnectedSocket() client: WebSocket,
  ) {
    if (!data || (data && !data.token)) {
      return responseFailure('无效数据');
    }
    try {
      const authToken = data.token;
      const jwtPayload: JwtPayload = <JwtPayload>(
        jwt.verify(authToken, app.name)
      );
      if (data.type === 'unsub') {
        client.protocol = '';
        return responseSuccess({});
      } else {
        client.protocol = jwtPayload.email;
        return {
          event: 'account',
          data: {
            WS_NOTES_UPDATE,
            WS_NOTES_ROMOVE,
            WS_NOTES_MEMBER_ADD,
            WS_NOTES_MEMBER_DELETE,
          },
        };
      }
    } catch (err) {
      return responseFailure('Token过期');
    }
  }

  @SubscribeMessage('edit')
  editEvent(
    @MessageBody() data: EventEdit,
    @ConnectedSocket() client: WebSocket,
  ) {
    if (!data || (data && !data.token)) {
      return responseFailure('无效数据');
    }
    try {
      const authToken = data.token;
      const jwtPayload: JwtPayload = <JwtPayload>(
        jwt.verify(authToken, app.name)
      );
      if (data.type === 'unsub') {
        this.informMembers(
          'edit',
          { type: 'unsub', id: data.id, member: jwtPayload.email },
          data.members,
        );
      } else {
        this.informMembers(
          'edit',
          { type: 'sub', id: data.id, member: jwtPayload.email },
          data.members,
        );
      }
    } catch (err) {
      return responseFailure('Token过期');
    }
  }

  /**
   * 通知成员
   */
  public informMembers<T = any>(event: string, data: T, members: string) {
    const _members = JSON.parse(members);
    this.server.clients.forEach(client => {
      const isOpen = client.readyState === WebSocket.OPEN;
      const isMember = client.protocol && _members[client.protocol];
      if (isOpen && isMember) {
        client.send(JSON.stringify({ event, data }));
      }
    });
  }
}
