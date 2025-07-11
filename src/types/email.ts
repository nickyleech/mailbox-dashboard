export interface Email {
  id: string;
  subject: string;
  from: string;
  supplier: string;
  channel: string;
  type: 'TV Schedule' | 'Update' | 'Press Release' | 'Other';
  hasAttachments: boolean;
  receivedDateTime: string;
  categories: string[];
  body?: string;
  attachments?: Attachment[];
  isRead?: boolean;
  isFlagged?: boolean;
  isDuplicate?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  contentType: string;
  size: number;
}

export interface EmailFilter {
  supplier?: string;
  channel?: string;
  type?: string;
  hasAttachments?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  categories?: string[];
  timeFilter?: 'last30min' | 'last1hour' | 'last3hours' | 'last6hours' | 'last12hours' | 'last24hours';
  showDuplicatesOnly?: boolean;
}

export interface SearchOptions {
  query: string;
  fields: ('subject' | 'from' | 'body')[];
  exact?: boolean;
}

export type SortField = 'receivedDateTime' | 'subject' | 'from' | 'supplier' | 'channel';
export type SortOrder = 'asc' | 'desc';

export interface EmailStats {
  totalEmails: number;
  supplierDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  attachmentCount: number;
  dailyVolume: { date: string; count: number }[];
  weeklyVolume: { week: string; count: number }[];
  monthlyVolume: { month: string; count: number }[];
  peakTimes: { hour: number; count: number }[];
  internalVsExternalRatio: { internal: number; external: number };
  responseTimeAnalysis: {
    avgResponseTime: number;
    fastestResponse: number;
    slowestResponse: number;
  };
  seasonalPatterns: {
    quarter: string;
    averageDaily: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}