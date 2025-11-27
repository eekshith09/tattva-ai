export enum UserRole {
  FREE = "FREE",
  PRO = "PRO",
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  coins: number;
  xp: number;
  level: number;
  dailyStreak: number;
  joinedDate: string;
}

export enum ToolType {
  TEXT_SUMMARIZER = "Text Summarizer",
  YOUTUBE_SUMMARIZER = "YouTube Summarizer",
  OCR = "OCR Scanner",
  IMAGE_TO_NOTES = "Image to Notes"
}

export interface HistoryItem {
  id: string;
  type: ToolType;
  title: string;
  summary: string;
  timestamp: Date;
}

export interface NoteStructure {
  heading: string;
  subpoints: string[];
  keyIdeas: string[];
  definitions: {
    term: string;
    definition: string;
  }[];
}
