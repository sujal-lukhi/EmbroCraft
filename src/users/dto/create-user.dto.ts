import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
import { Match } from '../../common/decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Minimum 6 characters' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'password123', description: 'Must match password' })
  @IsString()
  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;

  @ApiProperty({ enum: Role, example: Role.USER, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
