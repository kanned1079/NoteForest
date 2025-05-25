import { IsEmail, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
    @IsEmail()
    previousPassword: string;

    @IsString()
    newPassword: string;
}