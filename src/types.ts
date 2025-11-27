// --------------------------
// USER
// --------------------------
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

// --------------------------
// TOOL TYPES
// --------------------------
export enum ToolType {
  TEXT_SUMMARIZER = "Text Summarizer",
  YOUTUBE_SUMMARIZER = "YouTube Summarizer",
  OCR = "OCR Scanner",
  IMAGE_TO_NOTES = "Image to Notes",
  VISION_TOOLS = "Vision Tools",
}

// --------------------------
// HISTORY ITEMS (Unified)
// --------------------------
// Supports both title/summary and input/output
export interface HistoryItem {
  id: string;
  type: ToolType;

  // For Text Summarizer, YouTube, OCR
  title?: string;
  summary?: string;

  // For Vision tools
  input?: string;
  output?: string;

  timestamp: Date;
}

// --------------------------
// BADGES
// --------------------------
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredXp: number;
}

// --------------------------
// NOTES
// --------------------------
export interface NoteStructure {
  heading: string;
  subpoints: string[];
  keyIdeas: string[];
  definitions: {
    term: string;
    definition: string;
  }[];
}
