export interface Email {
  id: string;
  subject: string;
  from: string;
  supplier: string;
  channel: string;
  type: 'schedule' | 'update' | 'press' | 'technical' | 'marketing';
  hasAttachments: boolean;
  receivedDateTime: string;
  categories: string[];
  body?: string;
  attachments?: Attachment[];
  isRead?: boolean;
  isFlagged?: boolean;
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
}