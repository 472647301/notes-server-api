import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto, UserLogin } from './users.dto';
import { Request } from 'express';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 查询用户信息
   */
  @Get('/user/info')
  info(@Req() request: Request) {
    const email: string = <string>request.headers['email'];
    return this.usersService.info(email);
  }

  /**
   * 用户登录
   */
  @Post('/user/login')
  login(@Body() user: UserLogin) {
    return this.usersService.login(user);
  }

  /**
   * 用户注册
   */
  @Post('/user/register')
  register(@Body() user: UserDto) {
    return this.usersService.register(user);
  }

  /**
   * 用户注销
   */
  @Get('/user/logout')
  logout(@Req() request: Request) {
    const email: string = <string>request.headers['email'];
    return this.usersService.logout(email);
  }

  /**
   * 用户信息更新
   */
  @Post('/user/update')
  update(@Body() user: Partial<UserDto>) {
    return this.usersService.update(user);
  }

  /**
   * 发送邮件验证码
   */
  @Post('/send/code')
  sendCode(@Body() user: Pick<UserDto, 'email'>) {
    return this.usersService.sendCode(user);
  }
}
