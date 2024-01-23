import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { PostEntity } from 'src/post/post.entity';
@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Column()
  text: string;
  @CreateDateColumn()
  dateCreated: Date;

  @Column({ default: 0 })
  likes: number;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  commentedBy: UserEntity;
  @ManyToOne(() => PostEntity, (post) => post.comments)
  postId: PostEntity;
}
