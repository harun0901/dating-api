import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { SocketService } from './socket.service';
import { ChatDto } from '../chat/dtos/chat.dto';

// import { Event } from '../event/entities/event.entity';

@WebSocketGateway()
export class SocketGateway {

  @WebSocketServer()
  server: Server;

  users: string[] = [];

  constructor(
    private socketService: SocketService,
  ) {
    // this.socketService.event$.asObservable().subscribe(event => {
    //   this.sendEvent(event);
    // });
    this.socketService.message$.asObservable().subscribe((data: { userId: string, message: ChatDto }) => {
        this.sendMessage(data.userId, data.message);
    });
  }

  @SubscribeMessage('join')
  async join(@MessageBody() id: string) {
    this.users.push(id);
  }

  // sendEvent(event: Event) {
  //   this.server.emit(`${event.user.id}_events`, event);
  // }

  sendMessage(userId: string, message: ChatDto) {
    this.server.emit(`${userId}_messages`, message);
  }
}
