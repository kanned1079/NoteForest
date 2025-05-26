import {IsOptional, IsString} from "class-validator";

export class CreateKnowledgeDto {
    @IsString()
    title: string

    @IsString()
    @IsOptional()
    subtitle: string

    @IsString()
    @IsOptional()
    category: string

    @IsString()
    @IsOptional()
    content: string

    @IsString()
    @IsOptional()
    image_url: string

}
