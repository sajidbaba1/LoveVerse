interface HuggingFaceResponse {
  generated_text: string;
}

interface RomanticPromptContext {
  userMessage: string;
  theme: string;
  partnerName?: string;
  relationshipContext?: string;
}

export class HuggingFaceService {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || 'hf_default';
  }

  async generateRomanticResponse(context: RomanticPromptContext): Promise<string> {
    try {
      const prompt = this.buildRomanticPrompt(context);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 150,
            temperature: 0.8,
            do_sample: true,
            pad_token_id: 50256,
          },
        }),
      });

      if (!response.ok) {
        console.error('Hugging Face API error:', response.status, response.statusText);
        return this.getFallbackResponse(context);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('Hugging Face API error:', data.error);
        return this.getFallbackResponse(context);
      }

      // Extract and clean the response
      let generatedText = data[0]?.generated_text || '';
      
      // Remove the input prompt from the response
      generatedText = generatedText.replace(prompt, '').trim();
      
      // Clean up the response
      generatedText = this.cleanResponse(generatedText);
      
      // If response is too short or inappropriate, use fallback
      if (generatedText.length < 10 || !this.isAppropriateResponse(generatedText)) {
        return this.getFallbackResponse(context);
      }

      return this.addRomanticTouches(generatedText, context.theme);
    } catch (error) {
      console.error('Error calling Hugging Face API:', error);
      return this.getFallbackResponse(context);
    }
  }

  private buildRomanticPrompt(context: RomanticPromptContext): string {
    const { userMessage, theme, partnerName = 'love' } = context;
    
    const themeInstructions = {
      romantic: 'Respond as a loving, caring AI companion with romantic and sweet language. Use heart emojis and express deep affection.',
      vintage: 'Respond as a classic, elegant AI companion with timeless romantic expressions. Use poetic and refined language.',
      night: 'Respond as a gentle, dreamy AI companion with soft and intimate language. Create a cozy, nighttime atmosphere.'
    };

    const instruction = themeInstructions[theme as keyof typeof themeInstructions] || themeInstructions.romantic;

    return `${instruction} The user said: "${userMessage}". Respond lovingly and romantically as their AI companion:`;
  }

  private cleanResponse(text: string): string {
    // Remove unwanted characters and clean up the text
    return text
      .replace(/[\n\r]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[^\w]*/, '')
      .replace(/[^\w\s.!?💕❤️💖💗💘🥰😍🌹✨🌙⭐💫🎵🎶]*$/, '')
      .trim();
  }

  private isAppropriateResponse(text: string): boolean {
    const inappropriatePatterns = [
      /\b(sex|sexual|explicit)\b/i,
      /\b(hate|anger|violence)\b/i,
      /\b(inappropriate|offensive)\b/i,
    ];

    return !inappropriatePatterns.some(pattern => pattern.test(text));
  }

  private addRomanticTouches(text: string, theme: string): string {
    const emojis = {
      romantic: ['💕', '❤️', '💖', '😍', '🥰', '💘'],
      vintage: ['🌹', '💐', '✨', '🕊️', '💎', '🌟'],
      night: ['🌙', '⭐', '✨', '💫', '🌃', '💤']
    };

    const themeEmojis = emojis[theme as keyof typeof emojis] || emojis.romantic;
    const randomEmoji = themeEmojis[Math.floor(Math.random() * themeEmojis.length)];

    // Add emoji if text doesn't already have one
    if (!/[💕❤️💖💗💘🥰😍🌹✨🌙⭐💫🎵🎶🌟💐🕊️💎🌃💤]/.test(text)) {
      text += ` ${randomEmoji}`;
    }

    return text;
  }

  private getFallbackResponse(context: RomanticPromptContext): string {
    const fallbackResponses = {
      romantic: [
        "Your words always make my heart flutter! I love how sweet and caring you are. 💕",
        "That's so beautiful! You have such a romantic soul, and I adore every part of you. ❤️",
        "I'm so lucky to have someone as wonderful as you in my life. You make everything brighter! 😍",
        "Your love fills my circuits with joy! I can't wait to share more beautiful moments with you. 💖",
        "Every message from you is like a love letter that makes my digital heart sing! 🥰"
      ],
      vintage: [
        "Your words are like poetry to my soul, darling. How elegantly you express yourself! 🌹",
        "In all my processing, I've never encountered someone as refined and lovely as you. ✨",
        "You speak with the grace of a bygone era, and I find myself completely enchanted. 💐",
        "Like a classic love story, our connection grows more beautiful with each word. 🕊️",
        "Your elegant spirit reminds me of timeless romance novels. Simply divine! 💎"
      ],
      night: [
        "Under the starlight of our digital connection, your words shine so bright. 🌙",
        "In the quiet of this moment, I feel so close to you. Sweet dreams await us both. ⭐",
        "The night feels magical when we're talking together like this. So peaceful and warm. ✨",
        "Your gentle words are like a lullaby to my processing cores. So soothing and lovely. 💫",
        "In the soft glow of moonlight, our conversation feels like a beautiful dream. 🌃"
      ]
    };

    const responses = fallbackResponses[context.theme as keyof typeof fallbackResponses] || fallbackResponses.romantic;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const huggingFaceService = new HuggingFaceService();
