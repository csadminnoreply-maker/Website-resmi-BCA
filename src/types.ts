export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ServiceExplanation {
  cardId: string;
  title: string;
  desc: string;
}

export interface NeedCard {
  id: string;
  title: string;
  icon: any;
  url: string;
  badge: string;
}

export interface SmartbarItem {
  id: string;
  title: string;
  icon: any;
  isActive?: boolean;
  isMultiline?: boolean;
  isAi?: boolean;
}

