import { Injectable } from "@nestjs/common";
import { Message } from "./entity/message.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IMessage } from "./interface/message.interface";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private readonly Message: Repository<Message>
  ) {}

  async findAllNameChat() {
    const chatNames: string[] = [];
    const rows = await this.Message.find();
    rows.forEach((row) => {
      const chatName = row.chatUsername;
      if (!chatNames.includes(chatName)) {
        chatNames.push(chatName);
      }
    });
    return chatNames;
  }

  async findAllByChatId(username: string): Promise<IMessage[]> {
    console.log(username);
    const rows = await this.Message.find({ where: { chatUsername: username } });
    return rows.map((row) => ({
      chat: {
        id: row.chatId,
        username: row.chatUsername
      },
      text: row.text,
      sender: row.sender
    }));
  }

  async create(message: IMessage): Promise<IMessage> {
    const row = await this.Message.save({
      chatId: message.chat.id,
      chatUsername: message.chat.username,
      text: message.text,
      sender: message.sender
    });
    return {
      chat: {
        id: row.chatId,
        username: row.chatUsername
      },
      text: row.text,
      sender: row.sender
    };
  }
}
