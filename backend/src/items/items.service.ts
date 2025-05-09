import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { ImageProcessingService } from '../common/image-processing.service';
import { CreateItemDto } from './dtos/items.dto';
import { CLOTHING_LABELS,CLOTHING_OCCASION,CLOTHING_SEASON } from 'src/constants/clothing-labels';
import { GetUserItemsDto } from './dtos/get-user-items.dto';
import { COLOR_GROUPS, isColorCombinationValid } from 'src/constants/color-palette';
import { UpdateItemDto } from './dtos/update-item.dto';
import { User,UserDocument } from 'src/auth/user.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Outfit, OutfitDocument } from './schemas/outfit.schema';

@Injectable()
export class ItemsService {
  mongoose: any;
  private readonly logger = new Logger(ItemsService.name);
  constructor(
    private readonly imageProcessingService: ImageProcessingService,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Outfit.name) private readonly outfitModel: Model<OutfitDocument>,
  ) {}

  async createItem(
    file: Express.Multer.File,
    createItemDto: CreateItemDto,
    user: any, // Contains the payload from JWT strategy
  ): Promise<Item> {
    const { location, name } = createItemDto;


    const processedImagePath = await this.imageProcessingService.removeBackground(file.path);

    //const detectedColor = await this.imageProcessingService.analyzeColor(file.path);
    const detectedColor = await this.imageProcessingService.analyzeColor(processedImagePath);

    const detectedType= await this.imageProcessingService.classifyImageZeroShot(processedImagePath,CLOTHING_LABELS)

    const detectedSeason= await this.imageProcessingService.classifyImageZeroShot(processedImagePath,CLOTHING_SEASON)

    const detectedOccasion= await this.imageProcessingService.classifyImageZeroShot(processedImagePath,CLOTHING_OCCASION)
    let finalClothingType: string;

    if (detectedType.toLowerCase().includes('underwear')) {
      finalClothingType = 'underwear';
    } else {
      finalClothingType = detectedType;
    }
    

    const finalColor = detectedColor;
    const finalSeason =  detectedSeason;
    const finalOccasion = detectedOccasion;


    const newItem = new this.itemModel({
      name,
      originalImage: file.path,
      //processedImage: file.path,
      processedImage: processedImagePath,
      clothingType: finalClothingType,
      color: finalColor,
      season: finalSeason,
      occasion: finalOccasion,
      usedTimes: 0,
      location:location,
      owner: user.userId, // Set owner from the token payload.
      iswashing: false,
    });

    return newItem.save();
  }
  async createItem2(
    file: Express.Multer.File,
    createItemDto: CreateItemDto,
    user: any, // Contains the payload from JWT strategy
  ): Promise<Item> {
    const { location,name } = createItemDto;


    //const processedImagePath = await this.imageProcessingService.removeBackground(file.path);

    const detectedColor = await this.imageProcessingService.analyzeColor(file.path);
    //const detectedColor = await this.imageProcessingService.analyzeColor(processedImagePath);

    const detectedType= await this.imageProcessingService.classifyImageZeroShot(file.path,CLOTHING_LABELS)

    const detectedSeason= await this.imageProcessingService.classifyImageZeroShot(file.path,CLOTHING_SEASON)

    const detectedOccasion= await this.imageProcessingService.classifyImageZeroShot(file.path,CLOTHING_OCCASION)

  
    let finalClothingType: string;

    if (detectedType.toLowerCase().includes('underwear')) {
      finalClothingType = 'underwear';
    } else {
      finalClothingType = detectedType;
    }
    const finalColor = detectedColor;
    const finalSeason =  detectedSeason;
    const finalOccasion = detectedOccasion;


    const newItem = new this.itemModel({
      name,
      originalImage: file.path,
      processedImage: file.path,
      //processedImage: processedImagePath,
      clothingType: finalClothingType,
      color: finalColor,
      season: finalSeason,
      occasion: finalOccasion,
      usedTimes: 0,
      location:location,
      owner: user.userId, // Set owner from the token payload.
      iswashing: false,
    });

    return newItem.save();
  }

  async getItemsByUserId(userId: string, filters: GetUserItemsDto): Promise<Item[]> {
    const query: any = { owner: userId };
  
    if (filters.season && filters.season !== 'All') {
      query.season = filters.season;
    }
  
    if (filters.occasion && filters.occasion !== 'All') {
      query.occasion = filters.occasion;
    }
  
    if (filters.type && filters.type !== 'All') {
      query.clothingType = filters.type;
    }
  
    if (filters.color && filters.color !== 'All') {
      const colorGroup = COLOR_GROUPS[filters.color];
      query.color = colorGroup ? { $in: colorGroup } : filters.color;
    }
  
    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }
  
    return this.itemModel.find(query).exec();
  }

  

  async generateAllOutfits(userId: string, occasion: string, seasons: string[], page = 1): Promise<{
    items: Item[][],
    totalPages: number,
    total: number,
    rejected: { outfit: Item[], reason: string }[],
  }> {
    const outfits: Item[][] = [];
    const rejectedOutfits: { outfit: Item[], reason: string }[] = [];
  
    const isSummer = seasons.includes('summer wear');
  
    const clothes = await this.itemModel.find({
      owner: userId,
      occasion: occasion,
      season: { $in: seasons },
      iswashing: { $ne: true },  // 👈 skip items that are currently washing
    });
  
    const shoes = clothes.filter(i => i.clothingType === 'footwear');
    const pants = clothes.filter(i => ['pants', 'shorts'].includes(i.clothingType));
    const shirts = clothes.filter(i => ['shirt', 't-shirt'].includes(i.clothingType));
    const jackets = clothes.filter(i => i.clothingType === 'jacket');
    const accessories = clothes.filter(i => i.clothingType === 'accessory');
  
    const missingParts: string[] = [];
  
    if (!shoes.length) missingParts.push('footwear');
    if (!pants.length) missingParts.push('pants or shorts');
    if (!shirts.length) missingParts.push('shirts or t-shirts');
    if (!isSummer && !jackets.length) missingParts.push('jackets');
  
    if (missingParts.length > 0) {
      throw new BadRequestException(
        `Cannot generate outfit. Missing: ${missingParts.join(', ')}.`
      );
    }
  
    for (const shoe of shoes) {
      for (const pant of pants) {
        for (const shirt of shirts) {
          const jacketOptions = isSummer ? [null] : jackets;
          for (const jacket of jacketOptions) {
            const accOptions = [...accessories, null];
            for (const acc of accOptions) {
              const outfit = [shoe, pant, shirt];
              if (jacket) outfit.push(jacket);
              if (acc) outfit.push(acc);
  
              const colorCheck = isColorCombinationValid(outfit);
              if (colorCheck.valid) {
                outfits.push(outfit);
              } else {
                rejectedOutfits.push({ outfit, reason: colorCheck.reason || 'Unknown reason' });
              }
            }
          }
        }
      }
    }
  
    const maxCombinations = 600;
    const all = outfits.slice(0, maxCombinations);
  
    const totalPages = Math.ceil(all.length / 6);
    const clampedPage = Math.min(Math.max(1, page), 100);
    const start = (clampedPage - 1) * 6;
    const end = start + 6;
  
    return {
      items: all.slice(start, end),
      totalPages: Math.min(totalPages, 100),
      total: all.length,
      rejected: rejectedOutfits.slice(0, 10),
    };
  }
  


  async updateItem(itemId: string, dto: UpdateItemDto, userId: string) {
    const objectItemId = new Types.ObjectId(itemId);
  
    const item = await this.itemModel.findOneAndUpdate(
      {
        _id: objectItemId,
        owner: userId, // 🔥 match string to string
      },
      dto,
      { new: true },
    );
  
    if (!item) throw new NotFoundException('Item not found or not authorized');
    return item;
  }
  
  async resetUsedTimes(itemId: string, userId: string) {
    const objectItemId = new Types.ObjectId(itemId);
  
    // 🧠 Get user washingTime (default to 1)
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const washingTime = user.washingtime ?? 1;
  
    // 🧼 Check item first before modifying
    const item = await this.itemModel.findOne({
      _id: objectItemId,
      owner: userId,
    });
  
    if (!item) {
      throw new NotFoundException('Item not found or not authorized');
    }
  
    if (item.iswashing) {
      throw new BadRequestException('Item is already being washed');
    }
  
    // ✅ Now update
    item.usedTimes = 0;
    item.iswashing = true;
    (item as any).washingTime = washingTime; // optional if needed
    await item.save();
  
    return item;
  }
  
  
  
  

async deleteItem(itemId: string, userId: string) {
  const result = await this.itemModel.findOneAndDelete({
    _id: new Types.ObjectId(itemId),
    owner: userId, // ✅ match string-to-string
  });

  if (!result) {
    throw new NotFoundException('Item not found or not authorized');
  }

  return { message: 'Item deleted successfully' };
}

@Cron(CronExpression.EVERY_MINUTE)
async checkWashingItems() {
  this.logger.log('⏳ Checking washing items...');

  // Find all items currently marked as "washing"
  const washingItems = await this.itemModel.find({ iswashing: true });

  for (const item of washingItems) {
    try {
      const ownerId =
        typeof item.owner === 'string'
          ? new Types.ObjectId(item.owner)
          : item.owner;

      const user = await this.userModel.findOne({ _id: ownerId });

      if (!user || typeof user.washingtime !== 'number') {
        this.logger.warn(
          `⚠️ Skipping item ${item._id} — user not found or washingtime invalid.`,
        );
        continue;
      }

      if (!item.updatedAt) {
        this.logger.warn(`⚠️ Item ${item._id} has no updatedAt timestamp.`);
        continue;
      }

      const elapsedTime = Date.now() - new Date(item.updatedAt).getTime();
      const requiredMs = user.washingtime * 24 * 60 * 60 * 1000;

      if (elapsedTime >= requiredMs) {
        item.iswashing = false;
        await item.save();
        this.logger.log(`✅ Item ${item._id} is clean again!`);
      }
    } catch (err) {
      this.logger.error(
        `❌ Error while checking item ${item._id}: ${err.message}`,
      );
    }
  }
}

async incrementUsedTimes(itemId: string, userId: string, outfitIds?: string[]) {
  const objectItemId = new Types.ObjectId(itemId);

  const item = await this.itemModel.findOne({
    _id: objectItemId,
    owner: userId,
  });

  if (!item) throw new NotFoundException('Item not found or not authorized');
  if (item.iswashing) throw new BadRequestException('Item is currently being washed');

  item.usedTimes += 1;
  await item.save();

  // Save outfit if provided
  if (outfitIds && outfitIds.length > 1) {
    await this.saveOrUpdateOutfit(userId, outfitIds);
  }

  return { message: 'Usage incremented', usedTimes: item.usedTimes };
}


async saveOrUpdateOutfit(ownerId: string, itemIds: string[]) {
  const normalizedIds = itemIds.map(id => new Types.ObjectId(id)).sort();

  const existing = await this.outfitModel.findOne({
    owner: new Types.ObjectId(ownerId),
    items: { $all: normalizedIds, $size: normalizedIds.length },
  });

  if (existing) {
    existing.lastUsed = new Date();
    await existing.save();
  } else {
    await this.outfitModel.create({
      owner: ownerId,
      items: normalizedIds,
      lastUsed: new Date(),
    });
  }
}

async wearFullOutfit(userId: string, itemIds: string[]) {
  const normalizedUserId = new Types.ObjectId(userId);
  const objectIds = itemIds.map(id => new Types.ObjectId(id));
  const normalizedIncoming = objectIds.map(id => id.toString()).sort();

  // Fetch all outfits for user
  const allOutfits = await this.outfitModel.find({ owner: normalizedUserId });

  let matched: (OutfitDocument & Outfit & Required<{ _id: unknown; }> & { __v: number; }) | null = null;

  for (const outfit of allOutfits) {
    const existingNormalized = outfit.items.map(i => i.toString()).sort();

    const isSame =
      existingNormalized.length === normalizedIncoming.length &&
      normalizedIncoming.every((id, idx) => id === existingNormalized[idx]);

    if (isSame) {
      matched = outfit;
      break;
    }
  }

  if (matched) {
    matched.lastUsed = new Date();
    await matched.save();
  } else {
    await this.outfitModel.create({
      owner: normalizedUserId,
      items: objectIds,
      lastUsed: new Date(),
    });
  }
}
// items.service.ts
async getAllWornOutfits(userId: string) {
  return this.outfitModel.aggregate([
    {
      $match: {
        owner: new Types.ObjectId(userId),
      },
    },
    {
      $sort: { lastUsed: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: 'items', // ✅ make sure this matches the actual collection name (usually plural)
        localField: 'items',
        foreignField: '_id',
        as: 'items',
      },
    },
  ]);
}


}