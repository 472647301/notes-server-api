import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import * as app from '../../package.json';
import { JwtPayload } from '../controllers/users/users.dto';

const exclude = ['/send/code', '/user/login', '/user/register']; // 不需要鉴权的接口

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    if (exclude.includes(request.route.path)) {
      return true;
    }
    try {
      const authToken = request.headers.authorization;
      const jwtPayload: JwtPayload = <JwtPayload>(
        jwt.verify(authToken, app.name)
      );
      request.headers.email = jwtPayload ? jwtPayload.email : '';
      request.headers.nickname = jwtPayload ? jwtPayload.nickname : '';
      return Boolean(jwtPayload);
    } catch (err) {
      context.switchToHttp().getResponse().statusCode = 401;
      return false;
    }
  }
}
