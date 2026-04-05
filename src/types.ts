export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
}

export type PersonaStyle = 'lively' | 'gentle' | 'sharp' | 'chill' | 'cool';

export interface UserStyle {
  persona: string; // Custom description
  selectedStyle: PersonaStyle; // Predefined style category
  commonPhrases: string[];
  tone: "warm" | "cool" | "neutral";
  emojiPreference: "high" | "medium" | "low";
}

export interface GeneratedReply {
  id: string;
  content: string;
  styleMatch: number; // 0-100 score
}
