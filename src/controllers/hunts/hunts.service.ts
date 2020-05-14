import { Injectable, Inject, HttpService } from '@nestjs/common';
import { HUNTS_MODEL } from '../../config';
import { Model } from 'mongoose';
import { Hunts } from './hunts.interface';

@Injectable()
export class HuntsService {
  constructor(
    @Inject(HUNTS_MODEL)
    private readonly huntsModel: Model<Hunts>,
    private readonly httpService: HttpService,
  ) {}

  async notice(request: Request) {
    return this.httpService.get('http://127.0.0.1:8887/get_group_member_list', {
      params: {
        group_id: '296884495',
      },
    });
  }
}
