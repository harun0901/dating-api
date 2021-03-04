import { BadRequestException, Body, Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/index';
import { UsersService } from '../users/users.service';
import { ChatDto } from './dtos/chat.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserIdDto } from '../users/dtos/userId.dto';
import { SendModeratorMessageDto } from './dtos/send-moderator-message.dto';
import { GetModeratorMessageDto } from './dtos/get-moderator-message.dto';
import { TimeMessageDto } from './dtos/time-message.dto';
import { UserDto } from '../users/dtos/user.dto';

@ApiTags('Chat')
@Controller('sdate/chat')
export class ChatController {
  static validateChatRequest(sender: UserEntity, receiver: UserEntity) {
    if (!sender || !receiver) {
      throw new BadRequestException('Invalid sender/receiver info');
    }
    //#test - comparing if the users can have a chat
  }

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChatDto })
  @Post('send-message')
  async sendMessage(
    @Request() req,
    @Body() body: SendMessageDto,
  ): Promise<ChatDto> {
    const sender = await this.userService.findById(req.user.id);
    const receiver = await this.userService.findById(body.receiverId);
    ChatController.validateChatRequest(sender, receiver);
    return this.chatService.sendMessage(body, sender, receiver);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get before 10 chat list',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('getPartChatList')
  async getPartChatList(
    @Request() req,
    @Body() customerInfo: UserIdDto,
  ): Promise<ChatDto[]> {
    const customerUser = await this.userService.findById(customerInfo.id);
    const owner = await this.userService.findById(req.user.id);
    const res = await this.chatService.getPartChatList(customerUser, owner);
    return res;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get before all chat list',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Moderator,
    UserRole.Customer,
  ])
  @Put('getAllChatList')
  async getAllChatList(
    @Request() req,
    @Body() customerInfo: UserIdDto,
  ): Promise<ChatDto[]> {
    const customerUser = await this.userService.findById(customerInfo.id);
    const owner = await this.userService.findById(req.user.id);
    const res = await this.chatService.getAllChatList(customerUser, owner);
    return res;
  }

  /***********************Moderator*****************************/
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Send message from moderator',
  })
  @ApiOkResponse({ type: ChatDto })
  @Post('send-moderator-message')
  async sendModeratorMessage(
    @Request() req,
    @Body() body: SendModeratorMessageDto,
  ): Promise<ChatDto> {
    const sender = await this.userService.findById(body.senderId);
    const receiver = await this.userService.findById(body.receiverId);
    ChatController.validateChatRequest(sender, receiver);
    return this.chatService.sendMessage(body, sender, receiver);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get before 10 chat list',
  })
  @Put('getModeratorPartChatList')
  async getModeratorPartChatList(
    @Request() req,
    @Body() customerInfo: GetModeratorMessageDto,
  ): Promise<ChatDto[]> {
    const customerUser = await this.userService.findById(
      customerInfo.receiverId,
    );
    const owner = await this.userService.findById(customerInfo.senderId);
    const res = await this.chatService.getPartChatList(customerUser, owner);
    return res;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get before all chat list',
  })
  @Put('getModeratorAllChatList')
  async getModeratorAllChatList(
    @Request() req,
    @Body() customerInfo: GetModeratorMessageDto,
  ): Promise<ChatDto[]> {
    const customerUser = await this.userService.findById(
      customerInfo.receiverId,
    );
    const owner = await this.userService.findById(customerInfo.senderId);
    const res = await this.chatService.getAllChatList(customerUser, owner);
    return res;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get chat customers in timedto times',
  })
  @Post('getChatCustomers')
  async getChatCustomers(
    @Request() req,
    @Body() timedto: TimeMessageDto,
  ): Promise<UserDto[]> {
    const customerChats = await this.chatService.getTimeRangeCustomerChat(
      timedto.timeRangeNum,
    );
    const res = customerChats.map((item) => item.sender.toDto());
    return res;
  }
  /***********************Moderator*****************************/
  /*
  @Post(':chatId/message')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'chatId', required: true })
  @ApiOkResponse({ type: MessageDto })
  async sendMessage(@Request() req, @Param('chatId') chatId: string, @Body() body: SendMessageDto): Promise<MessageDto> {
    const user = await this.userService.findUserById(req.user.id);
    const chat = await this.chatService.findChatById(chatId);
    ChatController.validateChatRequest(chat, req.user);
    return this.chatService.sendMessage(body, chat, user);
  }



  @Post('init/project-consultation/:projectId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: Chat })
  async initProjectConsultationChat(@Request() req, @Param('projectId') projectId: string): Promise<Chat> {
    const project = await this.projectService.findProjectById(projectId, req.user);
    let users = await this.userService.findSuperAdmins();
    users = [...users, project.assignedConsultant, project.user];
    if (!project) {
      throw new BadRequestException('Invalid project id');
    }
    if (!project.assignedConsultant) {
      throw new BadRequestException('No consultant assigned to this project yet');
    }
    return this.chatService.initProjectConsultationChat(project, users);
  }

  @Post('init/sub-contract-consultation/:subContractId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'subContractId', required: true })
  @ApiOkResponse({ type: Chat })
  async initSubContractConsultation(@Request() req, @Param('subContractId') subContractId: string): Promise<Chat> {
    const subContract = await this.subContractService.findById(subContractId);
    const consultantUser = await this.userService.findUserByConsultantId(subContract.consultant.id);
    const contractorUser = await this.userService.findUserByContractorId(subContract.contractor.id);
    const user = await this.userService.findUserById(req.user.id);
    let users = await this.userService.findSuperAdmins();
    users = [...users, consultantUser, contractorUser];
    if (!subContract) {
      throw new BadRequestException('Invalid sub contract id');
    }
    if (user.role === UserRole.SuperAdmin || (user.role === UserRole.Contractor && subContract.contractor.id === user.contractorProfile.id)) {
      return this.chatService.initSubContractConsultationChat(subContract, users);
    } else {
      throw new BadRequestException('You are not allowed to initiate sub contract consultation chat.');
    }
  }

  @Post('init/contractor-onboarding-consultation/:contractorId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'contractorId', required: true })
  @ApiOkResponse({ type: Chat })
  async initContractorOnboardingConsultation(@Request() req, @Param('contractorId') contractorId: string): Promise<Chat> {
    const contractor = await this.userService.findUserById(contractorId);
    const admins = await this.userService.findSuperAdmins();
    const user = await this.userService.findUserById(req.user.id);
    if (!contractor && !contractor.contractorProfile) {
      throw new BadRequestException('Invalid contractor id');
    }
    if (user.role === UserRole.SuperAdmin || (user.role === UserRole.Contractor && user.id === contractorId)) {
      return this.chatService.initContractorOnboardingConsultationChat(contractor, admins);
    } else {
      throw new BadRequestException('You are not allowed to initiate contractor onboarding consultation chat.');
    }
  }

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: () => Chat, isArray: true })
  async getChats(@Query() query: PaginationDto, @Request() req): Promise<PaginatorDto<Chat>> {
    const [chats, count] = await this.chatService.findChatsByUserId(query.skip || 0, query.take || defaultTakeCount, req.user);
    return { data: chats, count };
  }

  @Post('email-reply')
  async replyFromEmail(@Request() req: any) {
    const form = new multiparty.Form();
    const res = await new Promise((resolve, reject) => {
      form.parse(req, (error, fields) => {
        if (error) {
          reject(error);
        }
        if (fields) {
          resolve(fields);
        }
      });
    });
    const domain = `@chat-reply.${process.env.DOMAIN}`;
    const from = extractEmailFromString(res['from'][0]);
    const to = extractEmailFromString(res['to'][0]);
    const text = res['html'][0];
    const chatId = to.slice(0, to.length - domain.length);
    const chat = await this.chatService.findChatById(chatId);
    const payload: SendMessageDto = {
      message: fromString(text),
    }
    const user = await this.userService.findUserByEmail(from);
    await this.chatService.sendMessage(payload, chat, user);
    return new SuccessResponse(true);
  }

  @Get('unread')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TotalUnreadDto })
  async getTotalUnreadCount(@Request() req): Promise<TotalUnreadDto> {
    return this.chatService.getTotalUnreadCount(req.user);
  }

  @Post('message/:messageId/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'messageId', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async readMessages(@Request() req, @Param('messageId') messageId: string): Promise<SuccessResponse> {
    return this.chatService.readMessageByIdAndUserId(messageId, req.user);
  }

  @Get(':chatId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'chatId', required: true })
  @ApiOkResponse({ type: Chat })
  async getChatById(@Request() req, @Param('chatId') chatId: string): Promise<Chat> {
    const chat = await this.chatService.findChatById(chatId);
    ChatController.validateChatRequest(chat, req.user);
    return chat;
  }

  @Get(':chatId/messages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'chatId', required: true })
  @ApiOkResponse({ type: MessageDto, isArray: true })
  async getMessages(@Request() req, @Query() query: PaginationDto, @Param('chatId') chatId: string): Promise<MessageDto[]> {
    const chat = await this.chatService.findChatById(chatId);
    ChatController.validateChatRequest(chat, req.user);
    const messages = await this.chatService.getMessages(chat, query.skip || 0, query.take || messageDefaultTakeCount);
    return messages.map(message => message.toDto(req.user.id));
  }

  @Post(':chatId/read/:until')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'chatId', required: true })
  @ApiImplicitParam({ name: 'until', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async readMessagesByDate(@Request() req, @Param('chatId') chatId: string, @Param('until') until: number): Promise<SuccessResponse> {
    return this.chatService.readMessagesUntilDateByUserAndChatId(new Date(until * 1000), req.user, chatId);
  }
*/
}
