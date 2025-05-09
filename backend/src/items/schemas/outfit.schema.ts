import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Item } from 'src/items/schemas/item.schema';
import { User } from 'src/auth/user.schema';

@Schema({ timestamps: true })
export class Outfit extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }], required: true })
  items: Item[];

  @Prop({ type: Date })
  lastUsed: Date;
}

export const OutfitSchema = SchemaFactory.createForClass(Outfit);

// ✅ Add this line:
export type OutfitDocument = Outfit & Document;
