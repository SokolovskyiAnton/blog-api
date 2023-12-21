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
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  nickname: string;
  @Column({ unique: true })
  email: string;
  @Exclude()
  @Column()
  password: string;
  @Column()
  profession: string;
  @Column({ length: 1000 })
  skills: string;
  @CreateDateColumn()
  dateCreated: Date;
  @Column({ nullable: true })
  avatar: string;
  @OneToMany(() => Post, (post) => post.postedBy)
  posts: Post[];
}
