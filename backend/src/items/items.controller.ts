import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/multer.config';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/items.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { GetUserItemsDto } from './dtos/get-user-items.dto';
import { Item } from './schemas/item.schema';
import { HuggingfaceTextClassifierService } from 'src/common/text-process.service';
import { UpdateItemDto } from './dtos/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService,
    private readonly hfService: HuggingfaceTextClassifierService,) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @UsePipes(new ValidationPipe({ transform: true }))
  async createItem(
    @UploadedFile() file: Express.Multer.File,
    @Body() createItemDto: CreateItemDto,
    @GetUser() user: any, // Authenticated user extracted from JWT payload
  ) {
    return this.itemsService.createItem2(file, createItemDto, user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserItems(
    @GetUser('userId') userId: string,
    @Query(new ValidationPipe({ transform: true }))
    filters: GetUserItemsDto,
  ) {
    return this.itemsService.getItemsByUserId(userId, filters);
  }

  @Get('generate-outfit')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateOutfits(
    @GetUser('userId') userId: string,
    @Query('text') text: string,
    @Query('season') season: string,
    @Query('page') page = 1,
  ): Promise<{
    items: Item[][],
    totalPages: number,
    total: number,
  }> {
    const occasionLabels = ['formal wear', 'casual wear', 'sports wear'];
    const occasion = await this.hfService.classifyTextZeroShot(text, occasionLabels);
  
    const seasons = Array.from(new Set([
      season?.toLowerCase(),
      'spring wear',
    ])).filter(Boolean);
  
    // 🧪 Log the parsed season list
    console.log('📦 Parsed seasons for query:', seasons);
  
    return this.itemsService.generateAllOutfits(userId, occasion, seasons, page);
  }
  
  @Patch(':id')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
async updateItem(
  @Param('id') id: string,
  @Body() updateDto: UpdateItemDto,
  @GetUser('userId') userId: string,
) {
  return this.itemsService.updateItem(id, updateDto, userId);
}

  @Post(':id/wash')
  @UseGuards(JwtAuthGuard)
  async washItem(
    @Param('id') itemId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.itemsService.resetUsedTimes(itemId, userId);
  }

  @Delete(':id')
@UseGuards(JwtAuthGuard)
async deleteItem(
  @Param('id') itemId: string,
  @GetUser('userId') userId: string,
) {
  return this.itemsService.deleteItem(itemId, userId);
}

@Post(':id/wear')
@UseGuards(JwtAuthGuard)
async wearItem(
  @Param('id') id: string,
  @GetUser('userId') userId: string,
  @Body('outfit') outfit?: string[]
) {
  return this.itemsService.incrementUsedTimes(id, userId, outfit);
}

@Post('wear-outfit')
@UseGuards(JwtAuthGuard)
async wearOutfit(
  @Body('outfit') outfit: string[],
  @GetUser('userId') userId: string,
) {
  return this.itemsService.wearFullOutfit(userId, outfit);
}
@Get('wornoutfits')
@UseGuards(JwtAuthGuard)
async getWornOutfits(@GetUser('userId') userId: string) {
  return this.itemsService.getAllWornOutfits(userId);
}



}
