import { Injectable, Inject, HttpService } from '@nestjs/common';
import { HUNTS_MODEL, responseSuccess, responseFailure } from '../../config';
import { Model } from 'mongoose';
import { Hunts } from './hunts.interface';
import { Request } from 'express';

@Injectable()
export class HuntsService {
  public baseUrl = 'http://127.0.0.1:8887';

  constructor(
    @Inject(HUNTS_MODEL)
    private readonly huntsModel: Model<Hunts>,
    private readonly httpService: HttpService,
  ) {}

  async notice(request: Request) {
    const ip = this.getClientIp(request);
    const group_id = <string>request.headers['GROUP_ID'];
    const member_id = <string>request.headers['MWMBER_ID'];
    if (!ip || !member_id) {
      return responseFailure('参数错误');
    }
    const model = await this.huntsModel.findOne({ ip: ip });
    if (
      (model && model.num > 100) ||
      (model && Number(model.time) + 5 * 60000 > Date.now())
    ) {
      return responseFailure('超过调用限制，请稍后在试');
    }
    if (model) {
      const num = model.num.toString();
      await this.huntsModel.updateOne(
        { ip: ip },
        {
          num: Number(num) + 1,
          time: Date.now().toString(),
        },
      );
    } else {
      await this.huntsModel.create({
        ip: ip,
        num: 1,
        time: Date.now().toString(),
      });
    }
    this.getGroupMemberList(
      group_id ? Number(group_id) : 296884495,
      Number(member_id),
    );
    return responseSuccess({});
  }

  async getGroupMemberList(group_id: number, member_id: number) {
    const group_member_list = this.httpService.post<
      CqhttpApi<Array<{ user_id: number }>>
    >(`${this.baseUrl}/get_group_member_list`, { group_id: group_id });
    const list: Array<number> = [];
    const res = await group_member_list.toPromise();
    if (res.data && res.data.data) {
      res.data.data.forEach(e => {
        list.push(e.user_id);
      });
    }
    if (!list.includes(member_id)) {
      return;
    }
    const send_group_msg = this.httpService.post(
      `${this.baseUrl}/send_group_msg`,
      {
        group_id: group_id,
        message: `[CQ:at,qq=${member_id}] 客户端已离线，请检查！`,
      },
    );
    await send_group_msg.toPromise();
  }

  public getClientIp(req: Request) {
    let ip =
      req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
      ip = ip.split(',')[0];
    }
    ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
    return ip;
  }
}
type CqhttpApi<T> = {
  data: T;
  retcode: number;
  status: string;
};
