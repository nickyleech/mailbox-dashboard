import { Email, EmailFilter, SearchOptions, EmailStats } from '@/types/email';

export function filterEmails(emails: Email[], filters: EmailFilter): Email[] {
  return emails.filter(email => {
    // Supplier filter
    if (filters.supplier && email.supplier !== filters.supplier) {
      return false;
    }

    // Channel filter
    if (filters.channel && email.channel !== filters.channel) {
      return false;
    }

    // Type filter
    if (filters.type && email.type !== filters.type) {
      return false;
    }

    // Attachments filter
    if (filters.hasAttachments !== undefined && email.hasAttachments !== filters.hasAttachments) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const emailDate = new Date(email.receivedDateTime);
      const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
      const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

      if (start && emailDate < start) return false;
      if (end && emailDate > end) return false;
    }

    // Categories filter
    if (filters.categories && filters.categories.length > 0) {
      const hasMatchingCategory = filters.categories.some(category => 
        email.categories.includes(category)
      );
      if (!hasMatchingCategory) return false;
    }

    return true;
  });
}

export function searchEmails(emails: Email[], searchOptions: SearchOptions): Email[] {
  if (!searchOptions.query.trim()) {
    return emails;
  }

  const query = searchOptions.query.toLowerCase();
  const isExact = searchOptions.exact;
  
  // Parse boolean operators
  const orParts = query.split(' or ').map(part => part.trim());
  
  return emails.filter(email => {
    return orParts.some(orPart => {
      // Handle NOT operator
      const notParts = orPart.split(' not ').map(part => part.trim());
      const mainQuery = notParts[0];
      const excludeTerms = notParts.slice(1);

      // Check if main query matches
      const mainMatch = searchOptions.fields.some(field => {
        const fieldValue = getFieldValue(email, field).toLowerCase();
        
        if (isExact) {
          return fieldValue.includes(mainQuery);
        } else {
          // Handle quoted phrases
          if (mainQuery.includes('"')) {
            const phrases = mainQuery.match(/"([^"]+)"/g) || [];
            return phrases.some(phrase => {
              const cleanPhrase = phrase.replace(/"/g, '');
              return fieldValue.includes(cleanPhrase);
            });
          }
          
          // Handle AND operator (default behavior for space-separated terms)
          const terms = mainQuery.split(' ').filter(term => term.length > 0);
          return terms.every(term => fieldValue.includes(term));
        }
      });

      // Check if any exclude terms match
      const hasExcludeMatch = excludeTerms.some(excludeTerm => {
        return searchOptions.fields.some(field => {
          const fieldValue = getFieldValue(email, field).toLowerCase();
          return fieldValue.includes(excludeTerm);
        });
      });

      return mainMatch && !hasExcludeMatch;
    });
  });
}

function getFieldValue(email: Email, field: 'subject' | 'from' | 'body'): string {
  switch (field) {
    case 'subject':
      return email.subject;
    case 'from':
      return email.from;
    case 'body':
      return email.body || '';
    default:
      return '';
  }
}

export function calculateEmailStats(emails: Email[]): EmailStats {
  const supplierDistribution = emails.reduce((acc, email) => {
    acc[email.supplier] = (acc[email.supplier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeDistribution = emails.reduce((acc, email) => {
    acc[email.type] = (acc[email.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const attachmentCount = emails.filter(email => email.hasAttachments).length;

  // Calculate daily volume for the last 7 days
  const today = new Date();
  const dailyVolume = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = emails.filter(email => {
      const emailDate = new Date(email.receivedDateTime);
      return emailDate.toISOString().split('T')[0] === dateStr;
    }).length;

    return { date: dateStr, count };
  }).reverse();

  return {
    totalEmails: emails.length,
    supplierDistribution,
    typeDistribution,
    attachmentCount,
    dailyVolume
  };
}

export function getUniqueChannels(emails: Email[]): string[] {
  const channels = new Set(emails.map(email => email.channel));
  return Array.from(channels).sort();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}