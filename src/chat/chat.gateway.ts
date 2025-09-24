import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer
} from "@nestjs/websockets";
import { Server } from "socket.io"; // важно импортировать Server из socket.io
import * as TelegramBot from "node-telegram-bot-api";
import { IMessage } from "./interface/message.interface";
import { ChatService } from "./chat.service";

@WebSocketGateway({
  namespace: "chat",
  cors: { origin: "*" },
  transports: ["websocket"]
})
@Injectable()
export class ChatGateway implements OnModuleInit {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server; // типизация
  private bot: TelegramBot;
  onModuleInit() {
    this.bot = new TelegramBot(
      "8216927187:AAHJA0bOdcv9S_ReSJoxW1tiVyqljDOAPpM",
      { polling: true }
    );
    this.bot.on("message", (msg: IMessage) => {
      if (!msg.chat.id) throw new BadRequestException("chatId is required");
      if (!msg.chat?.id) {
        console.warn("chatId missing", msg);
        return; // просто пропускаем это сообщение
      }
      msg.sender = "user";
      this.chatService.create(msg);
      this.server.emit("events", msg);
    });
  }

  @SubscribeMessage("events")
  async handleEvent(@MessageBody() data: IMessage) {
    const ChatName = await this.chatService.findAllByChatId(data.chat.username);
    console.log(ChatName);
    //console.log("Got event:", data);

    this.chatService.create(data);
    // Отправляем всем клиентам в namespace 'chat'
    this.server.emit("events", data);

    // Отправляем сообщение в Telegram
    this.bot.sendMessage(ChatName[0].chat.id, data.text);

    return data;
  }
}
