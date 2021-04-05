import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from 'src/Database/Repositories/post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
