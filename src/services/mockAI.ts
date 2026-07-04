import type { NoteStructure } from '../types.ts';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI SERVICE
 * 
 * Supports Google Gemini API.
 * Falls back to mock responses if no valid API key is configured.
 */

type Env = {
  VITE_GEMINI_API_KEY?: string;
};

const geminiKey = (import.meta as unknown as { env: Env }).env.VITE_GEMINI_API_KEY;

const geminiAI = geminiKey && geminiKey !== 'your_gemini_api_key_here' ? new GoogleGenerativeAI(geminiKey) : null;
const geminiModel = geminiAI ? geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
const geminiVisionModel = geminiAI ? geminiAI.getGenerativeModel({ model: "gemini-1.5-pro" }) : null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSummarizeText = async (text: string): Promise<string> => {
  if (text.length < 20) throw new Error("Text is too short to summarize.");

  if (geminiModel) {
    try {
      const result = await geminiModel.generateContent(`Please provide a concise summary of the following text:\n\n${text}`);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
    }
  }

  // Fallback: response
  await delay(1500);
  return `Here is a concise summary of your text:\n\nThe input text discusses key themes regarding "${text.substring(0, 15)}...". The main points are:\n• The central argument focuses on the importance of efficiency.\n• Secondary analysis suggests a need for robust error handling.\n• Conclusion emphasizes user experience as a priority.`;
};

export const mockYouTubeSummary = async (url: string): Promise<{ title: string; summary: string; keyLearnings: string[] }> => {
  // Basic validation
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w-]{10,12})\b/);
  if (!videoIdMatch) throw new Error("Invalid YouTube URL");

  if (geminiModel) {
    try {
      const prompt = `Provide a summary of the YouTube video with ID ${videoIdMatch[1]}. Include a title, summary paragraph, and 3 key learnings. Format as JSON:
{
  "title": "Video Title",
  "summary": "Summary text",
  "keyLearnings": ["point1", "point2", "point3"]
}`;
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
    } catch (error) {
      console.error("Gemini API error:", error);
    }
  }

  // Fallback: response
  await delay(2000);
  return {
    title: `Video Analysis: ${videoIdMatch[1]}`,
    summary: "This video provides a comprehensive overview of neural network architectures. The speaker breaks down the evolution from RNNs to Transformers, explaining the attention mechanism in detail.",
    keyLearnings: [
      "Transformers process data in parallel, unlike RNNs.",
      "Self-attention allows the model to weigh the importance of different words.",
      "Fine-tuning pretrained models is more efficient than training from scratch."
    ]
  };
};

export const mockOCR = async (file: File): Promise<string> => {
  try {
    // Attempt real client-side OCR
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log('OCR Log:', m) // Optional logger
    });
    
    if (!result.data.text.trim()) {
      return "No text detected in the image.";
    }
    
    return result.data.text;
  } catch (error) {
    console.error("OCR Error:", error);
    // Fallback if Tesseract fails (e.g. in some restricted environments)
    return `[Fallback Mode] We encountered an issue running the OCR engine in this environment.\n\nHere is a simulated extraction:\n\nProject Tattva Meeting Notes\nDate: Oct 24, 2023\n\nAgenda:\n1. Review Q3 Goals\n2. Discuss UI Component Library`;
  }
};

export const mockImageToNotes = async (file: File): Promise<NoteStructure> => {
  if (geminiVisionModel) {
    const prompt = `Analyze this image and convert it into structured study notes. Extract the main topic as a heading, key concepts as subpoints, important ideas, and any definitions. Format the response as JSON with the following structure:
{
  "heading": "Main Topic",
  "subpoints": ["point1", "point2"],
  "keyIdeas": ["idea1", "idea2"],
  "definitions": [{"term": "term1", "definition": "def1"}]
}`;

    try {
      const imageData = await fileToGenerativePart(file);
      const result = await geminiVisionModel.generateContent([prompt, imageData]);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
      return parsed;
    } catch (error) {
      console.error("Gemini Vision API error:", error);
    }
  }

  // Fallback: response
  await delay(3000);
  return {
    heading: "Introduction to Thermodynamics",
    subpoints: [
      "The First Law: Energy cannot be created or destroyed.",
      "The Second Law: Entropy of an isolated system always increases.",
      "Heat transfer occurs via conduction, convection, and radiation."
    ],
    keyIdeas: [
      "Energy conservation is fundamental.",
      "Efficiency of heat engines is limited by Carnot's theorem."
    ],
    definitions: [
      { term: "Entropy", definition: "A measure of the disorder of a system." },
      { term: "Enthalpy", definition: "Total heat content of a system." }
    ]
  };
};

// Helper function to convert file to generative part
type InlineDataPart = {
  inlineData: {
    data: string;
    mimeType: string;
  };
};

async function fileToGenerativePart(file: File): Promise<InlineDataPart> {

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      });
    };
    reader.readAsDataURL(file);
  });
}

export const mockChatQuery = async (query: string): Promise<string> => {
  if (geminiModel) {
    try {
      const result = await geminiModel.generateContent(`Answer this question: ${query}`);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
    }
  }

  // Fallback: response
  await delay(1000);
  return `Based on the video context, the answer to "${query}" involves understanding the balance between model size and inference latency. The speaker recommends starting with distilled models for edge deployment.`;
};