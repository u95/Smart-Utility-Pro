export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'blue';

export interface AppSettings {
  darkMode: boolean;
  accentColor: AccentColor;
  language: string;
  isPremium: boolean;
  adsEnabled: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  folder: string;
  isPinned: boolean;
  isChecklist: boolean;
  checklistItems: { id: string; text: string; done: boolean }[];
  createdAt: number;
}

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  passwordText: string;
  url: string;
  category: string;
  createdAt: number;
}

export interface QRHistoryEntry {
  id: string;
  type: 'text' | 'wifi' | 'contact' | 'email' | 'location' | 'whatsapp';
  value: string;
  timestamp: number;
}

export interface DownloadTask {
  id: string;
  name: string;
  url: string;
  progress: number;
  speed: string; // e.g. "4.2 MB/s"
  status: 'downloading' | 'paused' | 'completed' | 'error';
  size: string; // e.g. "12.4 MB"
}

export interface FileItem {
  id: string;
  name: string;
  size: number; // bytes
  type: 'pdf' | 'image' | 'video' | 'audio' | 'document' | 'other';
  path: string;
  createdAt: number;
}

export type ActiveTool = 
  | 'dashboard'
  | 'pdf_tools'
  | 'image_tools'
  | 'video_tools'
  | 'qr_tools'
  | 'doc_scanner'
  | 'file_manager'
  | 'calculator'
  | 'unit_converter'
  | 'notes'
  | 'password_vault'
  | 'download_manager'
  | 'wifi_tools'
  | 'device_info'
  | 'settings';
