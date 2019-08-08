import * as bcrypt from 'bcryptjs';
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('text') password: string;

  @BeforeInsert()
  async hashPassword() {
    /* Change salt # in prod */
    this.password = await bcrypt.hash(this.password, 10);
  }
}
