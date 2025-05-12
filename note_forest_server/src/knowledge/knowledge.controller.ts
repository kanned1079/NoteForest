import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import {JwtGuard} from "../auth/jwt/jwt.guard";
import {AdminGuard} from "../auth/admin.guard";
import {FetchKnowledgeDto} from "./dto/fetch-knowledge.dto";

@Controller({
  path: '/knowledge',
  version: '1',
})
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  create(@Body() createKnowledgeDto: CreateKnowledgeDto) {
    return this.knowledgeService.create(createKnowledgeDto);
  }

  @Get()
  findAll(@Query() fetchKnowledgeDto: FetchKnowledgeDto) {
    return this.knowledgeService.findAll(fetchKnowledgeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.knowledgeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateKnowledgeDto: UpdateKnowledgeDto) {
    return this.knowledgeService.update(id, updateKnowledgeDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.knowledgeService.remove(id);
  }
}
