import { Controller, Get, Req } from '@nestjs/common';
import { HuntsService } from './hunts.service';

@Controller()
export class HuntsController {
  constructor(private readonly huntsService: HuntsService) {}

  @Get('/hunts/notice')
  list(@Req() request: Request) {
    return this.huntsService.notice(request);
  }
}
