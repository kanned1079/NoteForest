import {IsString} from "class-validator";

export class CreateKnowledgeDto {
    @IsString()
    title: string

    @IsString()
    subtitle: string

    @IsString()
    category: string

    @IsString()
    content: string

}
