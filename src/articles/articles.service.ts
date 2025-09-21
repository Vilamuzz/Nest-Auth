import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}
  create(createArticleDto: CreateArticleDto) {
    return this.articleModel.create(createArticleDto);
  }

  findAll() {
    return this.articleModel.find().exec();
  }

  findOne(id: string) {
    return this.articleModel.findById(id).exec();
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    const deleted = await this.articleModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return deleted;
  }
}
