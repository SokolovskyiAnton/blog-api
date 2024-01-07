import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity('posts')
export class PostEntity {
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
  @ManyToOne(() => UserEntity, (user) => user.posts)
  postedBy: UserEntity;
}
