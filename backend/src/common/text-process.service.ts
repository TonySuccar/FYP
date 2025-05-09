import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class HuggingfaceTextClassifierService {
  private readonly API_URL = 'http://127.0.0.1:8000/classify-text';

  /**
   * Classify a piece of text using zero-shot classification.
   * @param text The input sentence or paragraph to classify.
   * @param classes An array of candidate labels to match.
   * @returns The top predicted label as a string.
   */
  async classifyTextZeroShot(text: string, classes: string[]): Promise<string> {
    console.log(`🧠 Classifying text: "${text}"`);
    console.log(`📚 Candidate labels: ${classes.join(', ')}`);

    try {
      const body = {
        text,
        candidate_labels: classes,
      };

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`❌ HTTP Error ${response.status}:`, errText);
        throw new InternalServerErrorException(`Local API error: ${errText}`);
      }

      const result = await response.json();

      console.log('✅ Classification result:', result);

      return result?.label || 'Unknown';
    } catch (error) {
      console.error('❌ Local text classification failed:', error);
      throw new InternalServerErrorException('Text classification failed');
    }
  }
}
