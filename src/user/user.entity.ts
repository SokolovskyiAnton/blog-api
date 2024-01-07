import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { PostEntity } from 'src/post/post.entity';
import { hash } from 'bcrypt';

@Entity('users')
export class UserEntity {
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
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 12);
  }
  @OneToMany(() => PostEntity, (post) => post.postedBy)
  posts: Array<PostEntity>;
}
