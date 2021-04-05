import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/Database/Entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from 'src/Database/Repositories/post.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    image: {
      originalname: string;
      buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>;
    },
    user: User,
  ) {
    try {
      const post = await this.postRepository.createPost(createPostDto, user);
      fs.writeFile(
        `./images/posts/${post.id}.jpeg`,
        Buffer.from(image.buffer),
        function (err) {
          if (err) {
            throw new InternalServerErrorException(err);
          }
        },
      );
      return post;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll() {
    const posts = await this.postRepository.find();

    posts.forEach((post) => {
      delete post.user.password;
      delete post.user.salt;
    });

    return posts;
  }

  async latest() {
    const posts = await this.postRepository.find({
      take: 3,
      order: { createdAt: 'DESC' },
    });

    posts.forEach((post) => {
      delete post.user.password;
      delete post.user.salt;
    });

    return posts;
  }

  async userPosts(id: number) {
    const posts = await this.postRepository.find({
      where: { user: id },
    });

    posts.forEach((post) => {
      delete post.user.password;
      delete post.user.salt;
    });

    return posts;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    delete post.user.password;
    delete post.user.salt;
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    console.log(updatePostDto);
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
