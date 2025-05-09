import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/user.schema';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  originalImage: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  processedImage: string;

  // Replace analysis with separate fields:
  @Prop({ required: true })
  clothingType: string; // e.g., "pant", "jacket", etc.

  @Prop({ required: true })
  color: string; // e.g., "blue", "red", etc.

  @Prop({ required: true })
  season: string; // e.g., "winter", "summer", "all season"

  @Prop({ required: true })
  occasion: string; // e.g., "sport", "casual", "formal", "allrounder"

  @Prop({ type: Number, default: 0 })
  usedTimes: number;

  @Prop({required:true})
  location: string;

  // Reference to the owner (User)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({ required: true })
  iswashing: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
