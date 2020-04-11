import { Injectable, Inject } from '@nestjs/common';
import {
  NOTES_MODEL,
  responseSuccess,
  responseFailure,
  USERS_MODEL,
  WS_NOTES_ROMOVE,
  WS_NOTES_UPDATE,
  WS_NOTES_MEMBER_ADD,
  WS_NOTES_MEMBER_DELETE,
} from '../../config';
import {
  NotesCreate,
  NotesRemove,
  NotesMember,
  JwtPayload,
  NotesUpdate,
} from './notes.dto';
import { Notes } from './notes.interface';
import { Users } from '../users/users.interface';
import { Model } from 'mongoose';
import { EventsGateway } from '../../events/events.gateway';
import * as WebSocket from 'ws';

@Injectable()
export class NotesService {
  constructor(
    @Inject(NOTES_MODEL)
    private readonly notesModel: Model<Notes>,
    @Inject(USERS_MODEL)
    private readonly usersModel: Model<Users>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  /**
   * 创建笔记
   */
  async create(notes: NotesCreate, jwt: JwtPayload) {
    const data = await this.notesModel.create({
      ...notes,
      author: jwt.email,
      update_name: jwt.nickname,
      members: JSON.stringify({ [jwt.email]: jwt.nickname }),
    });
    this.informMembers(WS_NOTES_UPDATE, { id: data._id }, data.members);
    return responseSuccess({ id: data._id });
  }

  /**
   * 移除笔记
   */
  async remove(notes: NotesRemove, jwt: JwtPayload) {
    const _notes = await this.notesModel.findOne({ _id: notes.id });
    if (!_notes) {
      return responseFailure('参数错误');
    }
    if (_notes.author !== jwt.email) {
      return responseFailure('没有权限');
    }
    await this.notesModel.deleteOne({ _id: notes.id });
    this.informMembers(WS_NOTES_ROMOVE, { id: notes.id }, _notes.members);
    return responseSuccess({});
  }

  /**
   * 更新笔记
   */
  async update(notes: NotesUpdate, jwt: JwtPayload) {
    const _notes = await this.notesModel.findOne({ _id: notes.id });
    if (!_notes) {
      return responseFailure('参数错误');
    }
    if (_notes.members.indexOf(jwt.email) === -1) {
      return responseFailure('没有权限');
    }
    await this.notesModel.updateOne(
      { _id: notes.id },
      { title: notes.title, content: notes.content, update_name: jwt.nickname },
    );
    this.informMembers(WS_NOTES_UPDATE, { id: notes.id }, _notes.members);
    return responseSuccess({ id: notes.id });
  }

  /**
   * 添加协作者
   */
  async addMember(data: NotesMember, jwt: JwtPayload) {
    const _notes = await this.notesModel.findOne({ _id: data.id });
    if (!_notes) {
      return responseFailure('参数错误');
    }
    if (_notes.author !== jwt.email) {
      return responseFailure('没有权限');
    }
    const user = await this.usersModel.findOne({ email: data.email });
    if (!user) {
      return responseFailure('邮箱未注册');
    }
    const members = _notes.members ? JSON.parse(_notes.members) : {};
    if (members[data.email]) {
      return responseFailure('邮箱已存在');
    }
    members[data.email] = user.nickname;
    await this.notesModel.updateOne(
      { _id: data.id },
      { members: JSON.stringify(members), update_name: jwt.nickname },
    );
    this.informMembers(
      WS_NOTES_MEMBER_ADD,
      { id: data.id },
      JSON.stringify(members),
    );
    return responseSuccess({});
  }

  /**
   * 移除协作者
   */
  async deleteMember(data: NotesMember, jwt: JwtPayload) {
    const _notes = await this.notesModel.findOne({ _id: data.id });
    if (!_notes) {
      return responseFailure('参数错误');
    }
    if (_notes.author !== jwt.email) {
      return responseFailure('没有权限');
    }
    const members = _notes.members ? JSON.parse(_notes.members) : {};
    if (members[data.email]) {
      delete members[data.email];
    }
    await this.notesModel.updateOne(
      { _id: data.id },
      { members: JSON.stringify(members), update_name: jwt.nickname },
    );
    this.informMembers(WS_NOTES_MEMBER_DELETE, { id: data.id }, _notes.members);
    return responseSuccess({});
  }

  /**
   * 查询笔记
   */
  async find(email: string) {
    const reg = new RegExp(email, 'i');
    const data = await this.notesModel.find({ members: reg });
    return responseSuccess(data);
  }

  /**
   * 通知成员
   */
  public informMembers<T = any>(event: string, data: T, members: string) {
    const server = this.eventsGateway.server;
    const _members = JSON.parse(members);
    server.clients.forEach(client => {
      const isOpen = client.readyState === WebSocket.OPEN;
      const isMember = client.protocol && _members[client.protocol];
      if (isOpen && isMember) {
        client.send(JSON.stringify({ event, data }));
      }
    });
  }
}
