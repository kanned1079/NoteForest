import { IsEmail, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsString()
    @MinLength(6, { message: 'password needs 6 characters at least.' })
    password: string;

}