import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
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
    unique: true,
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
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,30}$/)
  @Column({
    type: 'varchar',
  })
  password: string;
}
