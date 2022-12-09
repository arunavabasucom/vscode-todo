import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  text: string;

  @Column("boolean", { default: false })
  completed: boolean;

  @Column() /*it is the original column that is going to show on the database*/
  creatorId: number;

  @ManyToOne(() => User, (u) => u.todos)
  @JoinColumn({ name: "creatorId" })
  creator: Promise<User>;
}
