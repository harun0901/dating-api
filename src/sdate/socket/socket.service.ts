import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

// import { Event } from '../event/entities/event.entity';
import { ChatDto } from '../chat/dtos/chat.dto';

@Injectable()
export class SocketService {

  // event$: Subject<Event> = new Subject<Event>();

  message$: Subject<{ userId: string, message: ChatDto }> = new Subject<{ userId: string, message: ChatDto }>();

}
