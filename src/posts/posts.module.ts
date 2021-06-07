import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from 'src/Database/Repositories/post.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/Database/Schemas/post.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    AuthModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
