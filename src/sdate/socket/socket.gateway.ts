import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { SocketService } from './socket.service';
import { ChatDto } from '../chat/dtos/chat.dto';
import { NotificationDto } from '../notification/dtos/notification.dto';
import { UserRole } from '../users/enums';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server: Server;
  users: string[] = [];

  constructor(private socketService: SocketService) {
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
  }

  sendEvent(event: NotificationDto) {
    this.server.emit(`${event.receiver.id}_events`, event);
  }

  sendMessage(userId: string, message: ChatDto) {
    const receiver = message.receiver;
    if (receiver.role === UserRole.Moderator) {
      this.server.emit(`sdate_messages`, message);
    } else {
      this.server.emit(`${userId}_messages`, message);
    }
  }
}
