import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Entity,
  Unique,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['id', 'title'])
export class Post extends BaseEntity {
  constructor(title: string, subtitle: string, text: string) {
    super();
    this.title = title;
    this.subtitle = subtitle;
    this.text = text;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  text: string;

  @Column({ default: () => `now()` })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;
}
