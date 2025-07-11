'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Email, EmailFilter, SearchOptions } from '@/types/email';
import { useAuth } from '@/contexts/AuthContext';
import { transformGraphMessage, detectDuplicates, filterEmails, searchEmails } from '@/utils/emailProcessor';

interface UseGraphEmailsResult {
  emails: Email[];
  filteredEmails: Email[];
  loading: boolean;
  error: string | null;
  refreshEmails: () => Promise<void>;
  loadMoreEmails: () => Promise<void>;
  hasMore: boolean;
  totalCount: number;
}

interface UseGraphEmailsOptions {
  filters?: EmailFilter;
  searchOptions?: SearchOptions;
  pageSize?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  mailboxId?: string;
}

export const useGraphEmails = (options: UseGraphEmailsOptions = {}): UseGraphEmailsResult => {
  const { graphService, isAuthenticated } = useAuth();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  const {
    filters = {},
    searchOptions = { query: '', fields: ['subject', 'from'], exact: false },
    pageSize = 50,
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
    mailboxId = 'me'
  } = options;

  const fetchEmails = useCallback(async (skip: number = 0, append: boolean = false) => {
    if (!graphService || !isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const response = await graphService.getMessages({
        top: pageSize,
        skip: skip,
        select: [
          'id',
          'subject',
          'from',
          'receivedDateTime',
          'hasAttachments',
          'categories',
          'isRead',
          'flag',
          'bodyPreview'
        ],
        orderBy: 'receivedDateTime desc',
        mailboxId: mailboxId
      });

      const transformedEmails = response.value.map(transformGraphMessage);
      const emailsWithDuplicates = detectDuplicates(transformedEmails);

      if (append) {
        setEmails(prev => [...prev, ...emailsWithDuplicates]);
      } else {
        setEmails(emailsWithDuplicates);
      }

      setTotalCount(response['@odata.count'] || emailsWithDuplicates.length);
      setHasMore(response['@odata.nextLink'] !== undefined);

    } catch (err) {
      console.error('Failed to fetch emails:', err);
      setError('Failed to fetch emails. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [graphService, isAuthenticated, pageSize, mailboxId]);

  const refreshEmails = useCallback(async () => {
    await fetchEmails(0, false);
  }, [fetchEmails]);

  const loadMoreEmails = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchEmails(emails.length, true);
  }, [fetchEmails, emails.length, hasMore, loading]);

  // Apply filters and search
  const filteredEmails = useMemo(() => {
    let result = emails;

    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = filterEmails(result, filters);
    }

    // Apply search
    if (searchOptions.query.trim()) {
      result = searchEmails(result, searchOptions);
    }

    return result;
  }, [emails, filters, searchOptions]);

  // Initial fetch and refetch when mailbox changes
  useEffect(() => {
    if (isAuthenticated && graphService) {
      setEmails([]); // Clear existing emails when switching mailboxes
      fetchEmails();
    }
  }, [isAuthenticated, graphService, fetchEmails, mailboxId]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !isAuthenticated || !graphService) return;

    const interval = setInterval(refreshEmails, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, isAuthenticated, graphService, refreshEmails, refreshInterval]);

  return {
    emails,
    filteredEmails,
    loading,
    error,
    refreshEmails,
    loadMoreEmails,
    hasMore,
    totalCount
  };
};

// Helper hook for managing email actions
export const useEmailActions = () => {
  const { graphService } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const markAsRead = async (emailId: string) => {
    if (!graphService) return;

    try {
      setActionLoading(emailId);
      await graphService.markMessageAsRead(emailId);
    } catch (err) {
      console.error('Failed to mark email as read:', err);
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  const flagEmail = async (emailId: string, flagged: boolean = true) => {
    if (!graphService) return;

    try {
      setActionLoading(emailId);
      await graphService.flagMessage(emailId, flagged);
    } catch (err) {
      console.error('Failed to flag email:', err);
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  const assignCategories = async (emailId: string, categories: string[]) => {
    if (!graphService) return;

    try {
      setActionLoading(emailId);
      await graphService.assignCategoriesToMessage(emailId, categories);
    } catch (err) {
      console.error('Failed to assign categories:', err);
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  return {
    markAsRead,
    flagEmail,
    assignCategories,
    actionLoading
  };
};