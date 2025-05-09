import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ImageProcessingService } from '../common/image-processing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';
import { User, UserSchema } from 'src/auth/user.schema';
import { HuggingfaceTextClassifierService } from 'src/common/text-process.service';
import { Outfit, OutfitSchema } from './schemas/outfit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: User.name, schema: UserSchema },
      { name: Outfit.name, schema: OutfitSchema },
    ]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ImageProcessingService,HuggingfaceTextClassifierService]
})
export class ItemsModule {}
