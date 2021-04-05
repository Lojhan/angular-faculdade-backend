import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Post } from '../Entities/post.entity';
import { User } from '../Entities/user.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    return await this.save({ ...createPostDto, user });
  }
}
