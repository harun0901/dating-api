import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

import { ChatDto } from '../chat/dtos/chat.dto';
import { NotificationDto } from '../notification/dtos/notification.dto';

@Injectable()
export class SocketService {
  event$: Subject<NotificationDto> = new Subject<NotificationDto>();

  message$: Subject<{ userId: string; message: ChatDto }> = new Subject<{
    userId: string;
    message: ChatDto;
  }>();
}
