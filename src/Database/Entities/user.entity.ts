import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Post } from './post.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  constructor(username: string, password: string, salt: string, type: string) {
    super();

    this.username = username;
    this.password = password;
    this.salt = salt;
    this.type = type;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  type: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash == this.password;
  }
}
