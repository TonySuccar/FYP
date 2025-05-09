import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  @Prop({required: false,})
  profileImageUrl: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userid: string;

  @Prop({ required: true })
  washingtime: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
