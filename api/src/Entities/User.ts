import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Todo } from "./Todo";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("text", { unique: true })
  githubId: string;
  
  @OneToMany(() => Todo, (t) => t.creator)
  todos: Promise<Todo[]>; /*going to give an array of todos */
  
}
