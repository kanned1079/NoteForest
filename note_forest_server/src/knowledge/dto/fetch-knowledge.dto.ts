import {IsEmail, IsOptional, IsString, IsEnum, MinLength, IsNumber, IsBoolean} from 'class-validator';

export class FetchKnowledgeDto {
    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsNumber()
    size?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsBoolean()
    list?: boolean
}
