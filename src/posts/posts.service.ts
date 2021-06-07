import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/Database/Entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from 'src/Database/Repositories/post.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from 'src/Database/Schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto, image: any, user: User) {
    try {
      // const post = await this.postRepository.createPost(createPostDto, user);

      const post = await this.postModel.create({ ...createPostDto, user });
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
    return await this.postModel.find();
  }

  async latest() {
    return await this.postModel.find().sort('asc').limit(3);
  }

  async userPosts(id: string) {
    const posts = await this.postModel.find().where({ user: id });

    posts.forEach((post) => {
      delete post.user.password;
      delete post.user.salt;
    });

    return posts;
  }

  async findOne(_id: string) {
    const post = await this.postModel.findOne({ _id });
    return post;
  }

  async update(_id: string, updatePostDto: UpdatePostDto, file: any) {
    delete updatePostDto['image'];

    try {
      const result = await this.postModel
        .updateOne({ _id }, updatePostDto)
        .exec();
      fs.writeFile(
        `./images/posts/${_id}.jpeg`,
        Buffer.from(file.buffer),
        function (err) {
          if (err) {
            throw new InternalServerErrorException(err);
          }
        },
      );
      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async remove(_id: string): Promise<any> {
    return await this.postModel.deleteOne({ _id });
  }
}
