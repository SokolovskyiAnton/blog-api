import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Exclude()
  @Column()
  password: string;
  @CreateDateColumn()
  dateCreated: Date;
  @Column({ nullable: true })
  avatar: string;
  @OneToMany(() => Post, (post) => post.postedBy)
  posts: Post[];
}
