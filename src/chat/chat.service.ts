import { Between, Repository } from 'typeorm';
import { subHours } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatEntity } from './entities/chat.entity';
import { SocketService } from '../socket/socket.service';
import { UserEntity } from '../users/entities/user.entity';
import { SendMessageDto } from './dtos/send-message.dto';
import { ChatDto } from './dtos/chat.dto';
import { ChatDefault } from './enums';
import { UserRole } from '../users/enums';

interface UnreadMessage {
  messageId: string;
  message: string;
  attachments: string[];
  chatId: string;
  senderName: string;
  recipientId: string;
  recipient: UserEntity;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    private readonly socketService: SocketService,
  ) {}

  async sendMessage(
    payload: SendMessageDto,
    sender: UserEntity,
    receiver: UserEntity,
  ): Promise<ChatDto> {
    const chat = new ChatEntity();
    chat.sender = sender;
    chat.sender_delete = ChatDefault.SENDER_DELETE;
    chat.receiver = receiver;
    chat.receiver_delete = ChatDefault.RECEIVER_DELETE;
    chat.text = payload.text;
    chat.gift = payload.gift;
    chat.kiss = payload.kiss;
    chat.seen = ChatDefault.SEEN;
    const res = await this.chatRepository.save(chat);
    this.socketService.message$.next({
      userId: receiver.id,
      message: res.toDto(),
    });
    return res.toDto();
  }

  async getPartChatList(
    customer: UserEntity,
    owner: UserEntity,
  ): Promise<ChatDto[]> {
    const list = await this.chatRepository.find({
      relations: ['sender', 'receiver'],
      where: [
        {
          sender: customer,
          receiver: owner,
          receiver_delete: ChatDefault.RECEIVER_DELETE,
        },
        {
          sender: owner,
          receiver: customer,
          sender_delete: ChatDefault.SENDER_DELETE,
        },
      ],
      order: {
        createdAt: 'DESC',
      },
      skip: 0,
      take: 10,
    });
    const res = list.map((item) => item.toDto());
    return res.reverse();
  }

  async getAllChatList(
    customer: UserEntity,
    owner: UserEntity,
  ): Promise<ChatDto[]> {
    const list = await this.chatRepository.find({
      relations: ['sender', 'receiver'],
      where: [
        {
          sender: customer,
          receiver: owner,
          receiver_delete: ChatDefault.RECEIVER_DELETE,
        },
        {
          sender: owner,
          receiver: customer,
          sender_delete: ChatDefault.SENDER_DELETE,
        },
      ],
      order: {
        createdAt: 'ASC',
      },
    });
    const res = list.map((item) => item.toDto());
    return res;
  }

  async getTimeRangeCustomerChat(timeRangeNum: number): Promise<ChatDto[]> {
    const BeforeDate = (date: Date) =>
      Between(subHours(date, timeRangeNum), date);
    const res = await this.chatRepository.find({
      relations: ['sender', 'receiver'],
      where: {
        sender: {
          role: UserRole.Customer,
        },
        createdAt: BeforeDate(new Date()),
      },
    });
    return res;
  }
  /*
  findChatById(id: string): Promise<Chat> {
    return this.chatRepository.findOne({
      relations: ['project', 'project.customer', 'project.customer.user', 'project.consultant', 'project.consultant.user', 'users'],
      where: { id },
    });
  }

  async initProjectConsultationChat(project: Project, participants: User[]): Promise<Chat> {
    const chat = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.project', 'project')
      .leftJoinAndSelect('chat.users', 'users')
      .where('project.id = :id', { id: project.id })
      .getOne();
    return this.initChat(chat, participants, ChatType.ProjectConsultation, project);
  }

  async initSubContractConsultationChat(subContract: SubContract, participants: User[]): Promise<Chat> {
    const chat = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.subContract', 'subContract')
      .leftJoinAndSelect('chat.users', 'users')
      .where('subContract.id = :id', { id: subContract.id })
      .getOne();
    return this.initChat(chat, participants, ChatType.SubContractConsultation, subContract);
  }

  async initContractorOnboardingConsultationChat(contractor: User, participants: User[]): Promise<Chat> {
    // contractor profile id and contractor profile user id is different
    const chat = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'users')
      .where('contractor.id = :id', { id: contractor.contractorProfile.id })
      .getOne();
    return this.initChat(chat, [...participants, contractor], ChatType.ContractorOnboardingConsultation, contractor.contractorProfile);
  }

  async readMessageByIdAndUserId(id: string, user: User): Promise<SuccessResponse> {
    const message = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('message.from', 'from')
      .leftJoinAndSelect('message.status', 'status')
      .leftJoinAndSelect('status.user', 'status_user')
      .where('message.id = :id', { id })
      .getOne();
    const messageDto = message.toDto(user.id);
    if (!messageDto.readAt) {
      const status = message.status.find(status => status.user.id === user.id);
      await this.messageStatusRepository.update(status, { type: MessageStatusType.Read });
      return new SuccessResponse(true, 'Successfully marked a message as read');
    } else {
      return new SuccessResponse(false, 'Invalid message id or message is already opened');
    }
  }

  async readMessagesUntilDateByUserAndChatId(date: Date, user: User, chatId: string) {
    const messages = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('message.from', 'from')
      .leftJoinAndSelect('message.status', 'status')
      .leftJoinAndSelect('status.user', 'user')
      .where('chat.id = :chatId', { chatId })
      .andWhere('message.createdAt <= :date', { date })
      .getMany();
    const status = messages.reduce((merged, message) => [...merged, ...message.status.filter(s => s.user.id === user.id)], []);
    status.forEach(s => s.type = MessageStatusType.Read);
    await this.messageStatusRepository.save(status);
    return new SuccessResponse(true);
  }

  async findChatsByUserId(skip, take, user: User): Promise<[Chat[], number]> {
    const userId = user.id;
    const [chats, chatCount] = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.project', 'project')
      .leftJoinAndSelect('chat.contractorProfile', 'contractorProfile')
      .leftJoinAndSelect('chat.subContract', 'subContract')
      .leftJoinAndSelect('chat.users', 'users')
      .where('users.id =:userId', { userId })
      .skip(skip)
      .take(take)
      .getManyAndCount();

    // const [chats, chatCount] = await this.chatRepository.findAndCount({
    //   relations: ['project', 'contractorProfile', 'subContract', 'users'],
    //   where: {
    //     users: {
    //       id: userId
    //     }
    //   }
    // });
    const chatIds = chats.map(chat => chat.id);
    if (!chats.length) {
      return [[], 0];
    }
    const messages = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('message.status', 'status')
      .leftJoinAndSelect('status.user', 'user')
      .where('chat.id in (:...chatIds)', { chatIds })
      .getMany();
    // TODO: optimize query using typeorm
    const unreadMessages = messages.filter(message => !message.toDto(userId).readAt);
    return [chats.map(chat => {
      chat.unread = unreadMessages.filter(message => message.chat.id === chat.id).length;
      return chat;
    }), chatCount];
  }

  getMessages(chat: Chat, skip: number, take: number): Promise<Message[]> {
    return this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('message.from', 'from')
      .leftJoinAndSelect('message.status', 'status')
      .leftJoinAndSelect('status.user', 'user')
      .where('chat.id = :id', { id: chat.id })
      .orderBy('message.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async getTotalUnreadCount(user: User): Promise<TotalUnreadDto> {
    const messages = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('message.status', 'status')
      .leftJoinAndSelect('status.user', 'status_user')
      .where('status.type is null or status.type = :mailed', { mailed: MessageStatusType.Mailed })
      .andWhere('status_user.id = :userId', { userId: user.id })
      .getMany();
    return {
      total: messages.length
    };
  }

  private async initChat(chat: Chat, participants: User[], type: ChatType, data: Project | SubContract | ContractorProfile): Promise<Chat> {
    if (chat) {
      return chat;
    }
    const newChat = new Chat();
    if (type === ChatType.ProjectConsultation) {
      newChat.project = data as Project;
      newChat.type = ChatType.ProjectConsultation;
    } else if (type === ChatType.SubContractConsultation) {
      newChat.subContract = data as SubContract;
      newChat.type = ChatType.SubContractConsultation;
    } else if (type === ChatType.ContractorOnboardingConsultation) {
      newChat.contractorProfile = data as ContractorProfile;
      newChat.type = ChatType.ContractorOnboardingConsultation;
    }
    newChat.users = removeDuplicatesByField<User>(participants);
    return await this.chatRepository.save(newChat);
  }

  async getUnreadNotMailedMessages(): Promise<PendingMessage[]> {
    const messages = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.status', 'status')
      .leftJoinAndSelect('message.from', 'from')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('status.user', 'user')
      .where('status.type is null')
      .getMany();
    const unreadMessages = messages.reduce((merged: UnreadMessage[], message: Message) => {
      const messagesWithUser: UnreadMessage[] = message.status.map(status => ({
        messageId: message.id,
        message: message.text,
        attachments: message.attachments,
        chatId: message.chat.id,
        senderName: message.from.fullName,
        recipientId: status.user.id,
        recipient: status.user,
      }));
      return [...merged, ...messagesWithUser];
    }, []);

    const chatGroupsById = groupByArray(unreadMessages, 'chatId');
    const chatIds = Object.keys(chatGroupsById);
    return chatIds.reduce((merged: PendingMessage[], chatId: string) => {
      const chatMessages = chatGroupsById[chatId];
      const chatMessageGroupsByRecipientId = groupByArray(chatMessages, 'recipientId');
      const recipientIds = Object.keys(chatMessageGroupsByRecipientId);
      const messagesByRecipients: PendingMessage[] = recipientIds.reduce((merged: PendingMessage[], recipientId: string) => {
        const recipientMessages = chatMessageGroupsByRecipientId[recipientId];
        const recipientName = recipientMessages[0].recipient.fullName;
        const email = recipientMessages[0].recipient.email;
        const senderName = recipientMessages[0].senderName;
        const messageIds = recipientMessages.map(m => m.messageId);
        const message = recipientMessages.map(m => m.message).join('\n');
        const pendingMessage: PendingMessage = {
          chatId,
          recipientName,
          email,
          senderName,
          messageIds,
          message,
        };
        return [...merged, pendingMessage];
      }, []);
      return [...merged, ...messagesByRecipients];
    }, []);
  }

  async markPendingMessagesByIds(ids: string[]): Promise<any> {
    const messages = await this.messageRepository.findByIds(ids, { relations: ['status'] });
    const status = messages.reduce((merged, message) => [...merged, ...message.status.filter(s => !s.type)], []);
    status.forEach(s => s.type = MessageStatusType.Mailed);
    await this.messageStatusRepository.save(status);
  }

  // private static groupMessages(messages: Array<any>, from: MessageFrom): PendingMessage {
  //   const message = messages.reduce((msg, item) => {
  //     msg += item.message_text + '<br>';
  //     return msg;
  //   }, '');
  //   const createdAt = messages[messages.length - 1].message_createdAt;
  //   const email = from === MessageFrom.FromConsultant ? messages[0].customer_user_email : messages[0].consultant_user_email;
  //   const recipientName = MessageFrom.FromCustomer ? `${messages[0].consultant_user_firstName} ${messages[0].consultant_user_lastName}` : `${messages[0].customer_user_firstName} ${messages[0].customer_user_lastName}`;
  //   const senderName = MessageFrom.FromCustomer ? `${messages[0].customer_user_firstName} ${messages[0].customer_user_lastName}` : `${messages[0].consultant_user_firstName} ${messages[0].consultant_user_lastName}`;
  //   return {
  //     message,
  //     createdAt,
  //     email,
  //     project: messages[0].project_name,
  //     messageIds: messages.map(x => x.message_id),
  //     recipientName,
  //     senderName,
  //   };
  // }

   */
}
