import { Module, HttpModule } from '@nestjs/common';

import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
  imports: [HttpModule],
})
export class SocketModule {}
