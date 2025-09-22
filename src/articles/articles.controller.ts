import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBasicAuth,
} from '@nestjs/swagger';
import { Article } from './entities/article.entity';
import { BasicAuthGuard } from 'src/auth/guards/basic-auth.guard';

@Controller('articles')
@ApiTags('articles')
@ApiBasicAuth('basic')
@UseGuards(BasicAuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({ type: Article })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOkResponse({ type: Article, isArray: true })
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Article })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Article })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Article })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
