import { IsEmail, IsOptional, IsString, IsEnum, MinLength, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class UpdateUsernameDto {
    @IsString()
    id: string;

    @IsString()
    @IsNotEmpty({ message: '用户名是必填项' })
    @MinLength(4, { message: '用户名长度需在 4 - 20 位之间，且不能以数字开头' })
    @MaxLength(20, { message: '用户名长度需在 4 - 20 位之间，且不能以数字开头' })
    @Matches(/^[^\d]/, { message: '用户名不能以数字开头' })
    username: string;
}