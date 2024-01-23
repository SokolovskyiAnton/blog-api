import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from 'src/comment/comment.entity';
@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Column()
  title: string;
  @Column('longtext')
  fullText: string;
  @Column()
  description: string;
  @CreateDateColumn()
  dateCreated: Date;
  @Column({ nullable: true })
  image: string;
  @Column({ default: 0 })
  likes: number;
  @ManyToOne(() => UserEntity, (user) => user.posts)
  postedBy: UserEntity;
  @OneToMany(() => CommentEntity, (comment) => comment.postId)
  comments: Array<CommentEntity>;
}
