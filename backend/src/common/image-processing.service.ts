// src/items/image-processing.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { removeBackgroundFromImageFile } from 'remove.bg';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import FormData from 'form-data';
import fetch from 'node-fetch'; // npm install node-fetch@2

import { findClosestColorWithColorDiff } from './color-utils';
import { PREDEFINED_COLORS } from '../constants/color-palette';

@Injectable()
export class ImageProcessingService {
  constructor() {}

  /**
   * Removes background from an image using remove.bg API.
   */
  async removeBackground(imagePath: string): Promise<string> {
    console.log(`🧼 Removing background from: ${imagePath}`);

    const ext = path.extname(imagePath);
    const baseName = path.basename(imagePath, ext);
    const dir = path.dirname(imagePath);
    const outputFileName = `${baseName}-nobg${ext}`;
    const outputPath = path.join(dir, outputFileName);

    try {
      const { base64img } = await removeBackgroundFromImageFile({
        path: imagePath,
        apiKey: process.env.REMOVE_BG_API_KEY || 'none',
        size: 'auto',
        type: 'auto',
        crop: false,
        scale: '100%',
      });

      const imgBuffer = Buffer.from(base64img, 'base64');
      fs.writeFileSync(outputPath, imgBuffer);

      return outputPath;
    } catch (error) {
      console.error('❌ remove.bg error:', error);
      throw new InternalServerErrorException('Failed to remove background');
    }
  }

  

  /**
   * Calculates average RGB from a downsampled version of the image.
   */
  private async getAverageRgb(imagePath: string, size = 8): Promise<[number, number, number]> {
    try {
      const { data, info } = await sharp(imagePath)
        .resize(size, size)
        .raw()
        .toBuffer({ resolveWithObject: true });

      let rSum = 0, gSum = 0, bSum = 0, count = 0;

      for (let i = 0; i < data.length; i += info.channels) {
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
        count++;
      }

      return [
        Math.round(rSum / count),
        Math.round(gSum / count),
        Math.round(bSum / count),
      ];
    } catch (error) {
      console.error('❌ Error calculating average RGB:', error);
      throw new InternalServerErrorException('Failed to analyze color');
    }
  }

  /**
   * Determines the closest predefined color to the image's average color.
   */
  async analyzeColor(imagePath: string): Promise<string> {
    const [r, g, b] = await this.getAverageRgb(imagePath, 8);
    const colorName = findClosestColorWithColorDiff([r, g, b], PREDEFINED_COLORS);
    console.log(`🎨 Detected Color: RGB(${r}, ${g}, ${b}) → ${colorName}`);
    return colorName;
  }

  /**
   * Performs zero-shot image classification using Hugging Face Inference API (CLIP).
   */
  async classifyImageZeroShot(filePath: string, classes: string[]): Promise<string> {
    console.log(`🧠 Classifying image: ${filePath}`);
    console.log(`📚 Candidate labels: ${classes.join(', ')}`);
  
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath)); // 👈 match FastAPI
      form.append('candidate_labels', classes.join(',')); // 👈 match FastAPI
  
      const response = await fetch('http://127.0.0.1:8000/classify-image', {
        method: 'POST',
        body: form as any,
      });
  
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status} - ${errText}`);
      }
  
      const result = await response.json();
      console.log('✅ Classification result:', result);
  
      return result?.label || 'Unknown';
    } catch (error) {
      console.error('❌ Local image classification failed:', error);
      throw new InternalServerErrorException('Local image classification failed');
    }
  }
  
  
}
