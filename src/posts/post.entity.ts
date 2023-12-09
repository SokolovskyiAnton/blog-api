import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MaxLength, MinLength } from 'class-validator';
import { User } from 'src/users/users.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Column()
  title: string;
  @Column()
  fullText: string;
  @Column()
  description: string;
  @CreateDateColumn()
  dateCreated: Date;
  @Column({ nullable: true })
  image: string;
  @Column('simple-array', { nullable: true })
  likes: string[];
  @ManyToOne(() => User, (user) => user.posts)
  postedBy: User;
}
