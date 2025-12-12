export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface SpeechToTextResponse {
  text: string;
  confidence?: number;
}

export interface TextToGlossResponse {
  gloss: string;
  confidence?: number;
}

export class ApiService {
  private apiKey: string = '';
  private provider: string = 'openai';
  private baseUrls: Record<string, string> = {
    openai: 'https://api.openai.com/v1',
    huggingface: 'https://api-inference.huggingface.co',
    google: 'https://speech.googleapis.com/v1',
    azure: 'https://api.cognitive.microsoft.com'
  };

  setApiKey(apiKey: string, provider: string) {
    this.apiKey = apiKey;
    this.provider = provider;
  }

  async speechToText(audioBlob: Blob): Promise<ApiResponse> {
    if (!this.apiKey) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      switch (this.provider) {
        case 'openai':
          return await this.openaiSpeechToText(audioBlob);
        case 'huggingface':
          return await this.huggingfaceSpeechToText(audioBlob);
        case 'google':
          return await this.googleSpeechToText(audioBlob);
        case 'azure':
          return await this.azureSpeechToText(audioBlob);
        default:
          return { success: false, error: 'Unsupported provider' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async textToGloss(text: string): Promise<ApiResponse> {
    if (!this.apiKey) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      switch (this.provider) {
        case 'openai':
          return await this.openaiTextToGloss(text);
        case 'huggingface':
          return await this.huggingfaceTextToGloss(text);
        default:
          // Fallback to local processing
          return { success: true, data: { gloss: text.toUpperCase() } };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  private async openaiSpeechToText(audioBlob: Blob): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const response = await fetch(`${this.baseUrls.openai}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const result = await response.json();
    return {
      success: true,
      data: {
        text: result.text,
        confidence: 0.95 // OpenAI doesn't provide confidence scores
      }
    };
  }

  private async openaiTextToGloss(text: string): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrls.openai}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert in American Sign Language (ASL) and Indian Sign Language (ISL). Convert the given English text to sign language gloss notation. 

Rules for gloss conversion:
1. Remove articles (a, an, the)
2. Remove auxiliary verbs (is, are, was, were) unless essential
3. Use present tense forms
4. Maintain word order but simplify grammar
5. Use uppercase letters
6. Keep important content words
7. Convert "I am" to "I", "you are" to "YOU", etc.
8. Convert questions to appropriate gloss format

Examples:
"How are you?" → "HOW YOU"
"I am going to the store" → "I GO STORE"
"What is your name?" → "WHAT YOUR NAME"
"Thank you very much" → "THANK YOU VERY MUCH"

Convert this text to gloss: "${text}"`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const result = await response.json();
    const gloss = result.choices[0]?.message?.content?.trim() || text.toUpperCase();
    
    return {
      success: true,
      data: {
        gloss: gloss,
        confidence: 0.9
      }
    };
  }

  private async huggingfaceSpeechToText(audioBlob: Blob): Promise<ApiResponse> {
    const response = await fetch(
      `${this.baseUrls.huggingface}/models/openai/whisper-large-v3`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: audioBlob,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API error: ${error}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: {
        text: result.text || '',
        confidence: 0.9
      }
    };
  }

  private async huggingfaceTextToGloss(text: string): Promise<ApiResponse> {
    // Using a T5 model for text transformation
    const response = await fetch(
      `${this.baseUrls.huggingface}/models/t5-base`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `translate English to sign language gloss: ${text}`,
          parameters: {
            max_length: 100,
            temperature: 0.3,
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API error: ${error}`);
    }

    const result = await response.json();
    const gloss = result[0]?.generated_text || text.toUpperCase();
    
    return {
      success: true,
      data: {
        gloss: gloss,
        confidence: 0.85
      }
    };
  }

  private async googleSpeechToText(audioBlob: Blob): Promise<ApiResponse> {
    // Convert blob to base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    const response = await fetch(
      `${this.baseUrls.google}/speech:recognize?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-US',
          },
          audio: {
            content: base64Audio,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Google API error');
    }

    const result = await response.json();
    const transcript = result.results?.[0]?.alternatives?.[0]?.transcript || '';
    const confidence = result.results?.[0]?.alternatives?.[0]?.confidence || 0.9;

    return {
      success: true,
      data: {
        text: transcript,
        confidence: confidence
      }
    };
  }

  private async azureSpeechToText(audioBlob: Blob): Promise<ApiResponse> {
    // Azure Speech API implementation
    const response = await fetch(
      `${this.baseUrls.azure}/speechtotext/v3.0/transcriptions`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'Content-Type': 'audio/wav',
        },
        body: audioBlob,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Azure API error');
    }

    const result = await response.json();
    return {
      success: true,
      data: {
        text: result.DisplayText || '',
        confidence: result.Confidence || 0.9
      }
    };
  }

  // Audio recording utilities
  async startRecording(): Promise<MediaRecorder | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      return mediaRecorder;
    } catch (error) {
      console.error('Error starting recording:', error);
      return null;
    }
  }

  stopRecording(mediaRecorder: MediaRecorder): Promise<Blob> {
    return new Promise((resolve) => {
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        resolve(blob);
      };
      
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }
}