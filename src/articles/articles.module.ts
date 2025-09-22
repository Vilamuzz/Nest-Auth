import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './entities/article.entity';
import { UsersModule } from '../users/users.module';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Article',
        schema: ArticleSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, BasicAuthGuard],
})
export class ArticlesModule {}
