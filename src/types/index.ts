export type LeadStatus = "new" | "contacted" | "call_booked" | "client";

export type ContentGoal = "followers" | "leads" | "sales";

export type ContentTone = "luxury" | "professional" | "aggressive" | "educational";

export interface Lead {
  id: string;
  username: string;
  fullName: string;
  niche: string;
  source: string;
  status: LeadStatus;
  notes: string;
  followUpDate: string | null;
  createdAt: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  hook: string;
  niche: string;
  goal: ContentGoal;
  createdAt: string;
}

export interface PostPerformance {
  id: string;
  title: string;
  type: "reel" | "carousel" | "story" | "post";
  postedAt: string;
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  leadsGenerated: number;
}

export interface EngagementTarget {
  id: string;
  username: string;
  niche: string;
  followers: string;
  engagementRate: string;
  reason: string;
  lastEngaged: string | null;
}

export interface FollowUp {
  id: string;
  leadId: string;
  leadUsername: string;
  dueDate: string;
  note: string;
  completed: boolean;
}

export interface GeneratedContent {
  hook: string;
  reelScript: string;
  caption: string;
  cta: string;
  hashtags: string[];
  storySequence: string[];
  dmReplyTemplate: string;
}

export interface ReelScript {
  id: string;
  title: string;
  hook: string;
  script: string;
  duration: string;
  niche: string;
  createdAt: string;
}

export interface StorySet {
  id: string;
  idea: string;
  stories: { slide: number; content: string; type: string }[];
  createdAt: string;
}

export interface UserSettings {
  brandName: string;
  instagramHandle: string;
  niche: string;
  targetAudience: string;
  offer: string;
  defaultTone: ContentTone;
  defaultGoal: ContentGoal;
}

export interface CalendarItem {
  id: string;
  day: string;
  dayLabel: string;
  type: "reel" | "carousel" | "story" | "post";
  title: string;
  hook: string;
  status: "planned" | "posted" | "skipped";
  time: string;
}

export interface HashtagCluster {
  tier: "large" | "medium" | "small";
  hashtags: { tag: string; posts: string; competition: string }[];
}

export interface ProfileAuditItem {
  id: string;
  category: string;
  score: number;
  status: "good" | "warning" | "bad";
  tip: string;
}

export interface BestTimeSlot {
  day: string;
  time: string;
  score: number;
  reason: string;
}

export interface ViralFormat {
  id: string;
  name: string;
  description: string;
  structure: string[];
  example: string;
  avgViews: string;
}

export interface FollowerSnapshot {
  date: string;
  followers: number;
  gained: number;
  topPost?: string;
}

export interface Competitor {
  id: string;
  username: string;
  followers: string;
  niche: string;
  topPosts: { title: string; views: string; format: string; hook: string }[];
  patterns: string[];
}

export interface ContentSeriesPiece {
  day: number;
  type: "reel" | "carousel" | "story" | "post";
  title: string;
  hook: string;
  description: string;
}

export interface DailyEngagementTask {
  id: string;
  username: string;
  action: string;
  commentTemplate: string;
  completed: boolean;
}

export interface HookAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  variants: string[];
}
