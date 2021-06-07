import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/Database/Entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: any,
    @GetUser() user: User,
  ) {
    return this.postsService.create(createPostDto, file, user);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('latest')
  findLatest() {
    return this.postsService.latest();
  }

  @Get('user/:id')
  findUserPosts(@Param('id') id: string) {
    return this.postsService.userPosts(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: any,
  ) {
    return this.postsService.update(id, updatePostDto, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
