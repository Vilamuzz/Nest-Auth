import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Article {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty({ required: false, nullable: true })
  @Prop({ required: false, default: null })
  description?: string;

  @ApiProperty()
  @Prop({ required: true })
  body: string;

  @ApiProperty({ required: false, default: false })
  @Prop({ required: true, default: false })
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type ArticleDocument = Article & Document;

export const ArticleSchema = SchemaFactory.createForClass(Article);
