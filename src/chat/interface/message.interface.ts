export interface IMessage {
  chat: {
    id: number;
    username: string;
  };
  text: string;
  sender: string;
}
