import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { IMessage } from "./interface/message.interface";

@Controller("messages")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("/name")
  async getAllNameChat() {
    const message = await this.chatService.findAllNameChat();
    return message;
  }

  @Get(":id")
  async getMessageById(@Param("id") id: string) {
    const message = await this.chatService.findAllByChatId(id);
    return message;
  }

  @Post()
  async createMessage(data: IMessage): Promise<IMessage> {
    if (!data.chat.id) throw new BadRequestException("chatId is required");
    const message = await this.chatService.create(data);
    return message;
  }
}
