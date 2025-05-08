import { IsEmail, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';

export class UserLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: 'password needs 6 characters at least.' })
    password: string;
}