import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ type: Object, default: Date.now() })
  createdAt: Date;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  subtitle: string;

  @Prop({ type: String })
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
