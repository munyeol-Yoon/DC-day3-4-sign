import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserModel extends BaseModel {
  @IsString()
  @IsNotEmpty()
  @Column({
    type: 'varchar',
    length: 30,
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({
    type: 'varchar',
    length: 30,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column({
    type: 'varchar',
    length: 50,
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Column({
    type: 'varchar',
    length: 60,
  })
  password: string;
}
