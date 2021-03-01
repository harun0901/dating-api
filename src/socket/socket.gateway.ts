import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Client } from 'socket.io';
import { HttpService } from '@nestjs/common';

import { SocketService } from './socket.service';
import { ChatDto } from '../chat/dtos/chat.dto';
import { NotificationDto } from '../notification/dtos/notification.dto';
import { UserRole } from '../users/enums';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  private server: Server;
  users: string[] = [];

  constructor(private socketService: SocketService, private http: HttpService) {
    this.socketService.event$.asObservable().subscribe((event) => {
      this.sendEvent(event);
    });

    this.socketService.message$
      .asObservable()
      .subscribe((data: { userId: string; message: ChatDto }) => {
        this.sendMessage(data.userId, data.message);
      });
  }

  @SubscribeMessage('join')
  async join(@MessageBody() id: string) {
    this.users.push(id);
    this.socketService.onlineUsers = this.users;
  }

  @SubscribeMessage('endjoin')
  async endjoin(@MessageBody() id: string) {
    const index = this.users.indexOf(id);
    this.users.splice(index);
    this.socketService.onlineUsers = this.users;
  }

  sendEvent(event: NotificationDto) {
    this.server.emit(`${event.receiver.id}_events`, event);
  }

  async sendMessage(userId: string, message: ChatDto) {
    const receiver = message.receiver;
    if (receiver.role === UserRole.Moderator) {
      const res = await this.http
        .post<ChatDto>(
          `${process.env.MODERATOR_URL}/smoderator/chat/send-message-event`,
          message,
        )
        .toPromise();
    } else {
      this.server.emit(`${userId}_messages`, message);
    }
  }
}
