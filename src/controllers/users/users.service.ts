import { Injectable, Inject } from '@nestjs/common';
import {
  JwtPayload,
  UserDto,
  UserLogin,
  Nickname,
  Password,
} from './users.dto';
import {
  USERS_MODEL,
  responseSuccess,
  responseFailure,
  sendEmail,
} from '../../config';
import { Users } from './users.interface';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as app from '../../../package.json';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_MODEL)
    private readonly usersModel: Model<Users>,
  ) {}

  /**
   * 用户信息验证
   */
  async validateUser(jwtPayload: JwtPayload) {
    return jwtPayload;
  }

  /**
   * 查询用户信息
   */
  async info(email: string, nickname: string) {
    return responseSuccess({ email, nickname });
  }

  /**
   * 用户登录
   */
  async login(user: UserLogin) {
    const { email, password } = user;
    const _user = await this.usersModel.findOne({ email });
    if (!_user) {
      return responseFailure('账号不存在');
    }
    if (_user.password !== password) {
      return responseFailure('账号或密码错误');
    }
    if (_user.active_code) {
      return responseFailure('请完善注册流程');
    }
    const jwtPayload = {
      email: _user.email,
      nickname: _user.nickname,
    };
    // 签发token
    const token = jwt.sign(jwtPayload, app.name, { expiresIn: '7d' });
    return responseSuccess({ token, nickname: _user.nickname });
  }

  /**
   * 用户注册
   */
  async register(user: UserDto) {
    const { email, active_code, nickname } = user;
    const _user = await this.usersModel.findOne({ email });
    if (!_user) {
      return responseFailure('账号不存在');
    }
    if (_user.active_code !== active_code) {
      return responseFailure('请输入正确的验证码');
    }
    await this.usersModel.updateOne({ email }, { ...user, active_code: '' });
    const jwtPayload = {
      email: email,
      nickname: nickname,
    };
    // 签发token
    const token = jwt.sign(jwtPayload, app.name, { expiresIn: '7d' });
    return responseSuccess({ token });
  }

  /**
   * 用户注销
   */
  async logout(email: string) {
    return responseSuccess({ email });
  }

  /**
   * 用户昵称更新
   */
  async nickname(email: string, user: Nickname) {
    const _user = await this.usersModel.findOne({ email });
    if (!_user) {
      return responseFailure('账号不存在');
    }
    await this.usersModel.updateOne({ email }, { nickname: user.nickname });
    return responseSuccess({ nickname: user.nickname, email });
  }

  /**
   * 用户密码更新
   */
  async passeord(email: string, user: Password) {
    const _user = await this.usersModel.findOne({ email });
    if (!_user) {
      return responseFailure('账号不存在');
    }
    if (_user.password !== user.old_password) {
      return responseFailure('旧密码错误');
    }
    await this.usersModel.updateOne({ email }, { password: user.new_password });
    return responseSuccess({});
  }

  /**
   * 发送邮件验证码
   */
  async sendCode(user: Pick<UserDto, 'email'>) {
    const { email } = user;
    const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!reg.test(email)) {
      return responseFailure('请输入正确的邮箱');
    }
    const _user = await this.usersModel.findOne({ email });
    if (_user) {
      return responseFailure('邮箱已注册');
    }
    const data = await sendEmail(email);
    if (!data || (data && !data.code)) {
      return responseFailure('验证码发送失败');
    }
    await this.usersModel.create({
      email: email,
      active_code: data.code,
    });
    return responseSuccess({ email });
  }
}
