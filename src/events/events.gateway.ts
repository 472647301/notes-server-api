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
import { EventAccount } from './events.interface';

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
  handleEvent(
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
        return responseSuccess({
          WS_NOTES_UPDATE,
          WS_NOTES_ROMOVE,
          WS_NOTES_MEMBER_ADD,
          WS_NOTES_MEMBER_DELETE,
        });
      }
    } catch (err) {
      return responseFailure('Token过期');
    }
  }
}
