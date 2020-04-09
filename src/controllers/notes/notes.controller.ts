import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import {
  NotesCreate,
  NotesRemove,
  NotesUpdate,
  NotesMember,
} from './notes.dto';
import { Request } from 'express';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  /**
   * 创建笔记
   */
  @Post('/notes/create')
  create(@Req() request: Request, @Body() notes: NotesCreate) {
    const email: string = <string>request.headers['email'];
    const nickname: string = <string>request.headers['nickname'];
    return this.notesService.create(notes, { email, nickname });
  }

  /**
   * 移除笔记
   */
  @Post('/notes/remove')
  remove(@Req() request: Request, @Body() notes: NotesRemove) {
    const email: string = <string>request.headers['email'];
    const nickname: string = <string>request.headers['nickname'];
    return this.notesService.remove(notes, { email, nickname });
  }

  /**
   * 更新笔记
   */
  @Post('/notes/update')
  update(@Req() request: Request, @Body() notes: NotesUpdate) {
    const email: string = <string>request.headers['email'];
    const nickname: string = <string>request.headers['nickname'];
    return this.notesService.update(notes, { email, nickname });
  }

  /**
   * 添加协作者
   */
  @Post('/notes/member/add')
  addMember(@Req() request: Request, @Body() notes: NotesMember) {
    const email: string = <string>request.headers['email'];
    const nickname: string = <string>request.headers['nickname'];
    return this.notesService.addMember(notes, { email, nickname });
  }

  /**
   * 移除协作者
   */
  @Post('/notes/member/delete')
  deleteMember(@Req() request: Request, @Body() notes: NotesMember) {
    const email: string = <string>request.headers['email'];
    const nickname: string = <string>request.headers['nickname'];
    return this.notesService.deleteMember(notes, { email, nickname });
  }

  /**
   * 移除协作者
   */
  @Get('/notes/find')
  find(@Req() request: Request) {
    const email: string = <string>request.headers['email'];
    return this.notesService.find(email);
  }
}
