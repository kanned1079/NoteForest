import {IsEmail, IsOptional, IsString, IsEnum, MinLength, IsNumber} from 'class-validator';

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
}