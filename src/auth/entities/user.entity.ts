import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 30,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 60,
  })
  password: string;
}
