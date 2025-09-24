import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  chatId: number;

  @Column({ type: "varchar", length: 255 })
  chatUsername: string;

  @Column({ type: "text" })
  text: string;

  @Column({ type: "varchar", length: 100 })
  sender: string;
}
