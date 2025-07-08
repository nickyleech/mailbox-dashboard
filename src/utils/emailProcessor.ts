import { Email, EmailFilter, SearchOptions, EmailStats, EmailAttachment } from '@/types/email';
import { supplierConfig } from '@/data/mockEmails';

// Function to detect duplicates and mark them
export function detectDuplicates(emails: Email[]): Email[] {
  const processedEmails = emails.map(email => ({ ...email, isDuplicate: false }));
  
  // Create a map to track similar emails
  const similarityMap = new Map<string, Email[]>();
  
  processedEmails.forEach(email => {
    // Create a similarity key based on subject and sender
    const normalizedSubject = email.subject
      .toLowerCase()
      .replace(/^(re:|fwd?:|fw:)\s*/i, '') // Remove reply/forward prefixes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    const similarityKey = `${email.from}-${normalizedSubject}`;
    
    if (!similarityMap.has(similarityKey)) {
      similarityMap.set(similarityKey, []);
    }
    
    similarityMap.get(similarityKey)!.push(email);
  });
  
  // Mark duplicates (keep the first email, mark others as duplicates)
  similarityMap.forEach(similarEmails => {
    if (similarEmails.length > 1) {
      // Sort by received date to keep the earliest
      similarEmails.sort((a, b) => new Date(a.receivedDateTime).getTime() - new Date(b.receivedDateTime).getTime());
      
      // Mark all except the first as duplicates
      for (let i = 1; i < similarEmails.length; i++) {
        similarEmails[i].isDuplicate = true;
      }
    }
  });
  
  return processedEmails;
}

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

    // Time filter
    if (filters.timeFilter) {
      const now = new Date();
      const emailDate = new Date(email.receivedDateTime);
      let minutesAgo = 0;

      switch (filters.timeFilter) {
        case 'last30min':
          minutesAgo = 30;
          break;
        case 'last1hour':
          minutesAgo = 60;
          break;
        case 'last3hours':
          minutesAgo = 180;
          break;
        case 'last6hours':
          minutesAgo = 360;
          break;
        case 'last12hours':
          minutesAgo = 720;
          break;
        case 'last24hours':
          minutesAgo = 1440;
          break;
      }

      const cutoffTime = new Date(now.getTime() - minutesAgo * 60 * 1000);
      if (emailDate < cutoffTime) return false;
    }

    // Duplicates filter
    if (filters.showDuplicatesOnly && !email.isDuplicate) {
      return false;
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

// Transform Microsoft Graph API message to our Email format
export function transformGraphMessage(graphMessage: unknown): Email {
  const message = graphMessage as Record<string, unknown>;
  const from = (message.from as Record<string, unknown>)?.emailAddress?.address as string || '';
  const supplier = identifySupplier(from);
  const channel = identifyChannel(message.subject as string, supplier);
  const type = identifyEmailType(message.subject as string);
  
  return {
    id: message.id as string,
    subject: (message.subject as string) || '',
    from: from,
    supplier: supplier,
    channel: channel,
    type: type,
    hasAttachments: message.hasAttachments as boolean || false,
    receivedDateTime: message.receivedDateTime as string,
    categories: (message.categories as string[]) || [],
    isRead: message.isRead as boolean || false,
    isFlagged: (message.flag as Record<string, unknown>)?.flagStatus === 'flagged',
    body: (message.bodyPreview as string) || '',
    attachments: message.attachments ? transformAttachments(message.attachments as unknown[]) : undefined,
    isDuplicate: false
  };
}

// Transform Graph API attachments to our format
export function transformAttachments(graphAttachments: unknown[]): EmailAttachment[] {
  const attachments = graphAttachments as Record<string, unknown>[];
  return attachments.map(attachment => ({
    id: attachment.id as string,
    name: attachment.name as string,
    contentType: attachment.contentType as string,
    size: attachment.size as number
  }));
}

// Identify supplier from email address
export function identifySupplier(fromAddress: string): string {
  const domain = fromAddress.split('@')[1]?.toLowerCase();
  
  if (!domain) return 'Unknown';
  
  for (const [supplier, config] of Object.entries(supplierConfig)) {
    if (config.domains.some(supplierDomain => domain.includes(supplierDomain))) {
      return supplier;
    }
  }
  
  return 'Unknown';
}

// Identify channel from subject and supplier
export function identifyChannel(subject: string, supplier: string): string {
  const lowerSubject = subject.toLowerCase();
  
  // BBC channels
  if (supplier === 'BBC') {
    if (lowerSubject.includes('bbc one') || lowerSubject.includes('bbc1')) return 'BBC One';
    if (lowerSubject.includes('bbc two') || lowerSubject.includes('bbc2')) return 'BBC Two';
    if (lowerSubject.includes('bbc three') || lowerSubject.includes('bbc3')) return 'BBC Three';
    if (lowerSubject.includes('bbc four') || lowerSubject.includes('bbc4')) return 'BBC Four';
    if (lowerSubject.includes('cbbc')) return 'CBBC';
    if (lowerSubject.includes('cbeebies')) return 'CBeebies';
    if (lowerSubject.includes('bbc news')) return 'BBC News';
    if (lowerSubject.includes('bbc parliament')) return 'BBC Parliament';
    return 'BBC';
  }
  
  // ITV channels
  if (supplier === 'ITV') {
    if (lowerSubject.includes('itv2')) return 'ITV2';
    if (lowerSubject.includes('itv3')) return 'ITV3';
    if (lowerSubject.includes('itv4')) return 'ITV4';
    if (lowerSubject.includes('itvbe')) return 'ITVBe';
    if (lowerSubject.includes('citv')) return 'CITV';
    return 'ITV1';
  }
  
  // Channel 4 channels
  if (supplier === 'Channel 4') {
    if (lowerSubject.includes('e4')) return 'E4';
    if (lowerSubject.includes('more4')) return 'More4';
    if (lowerSubject.includes('film4')) return 'Film4';
    if (lowerSubject.includes('4music')) return '4Music';
    return 'Channel 4';
  }
  
  // Sky channels
  if (supplier === 'Sky') {
    if (lowerSubject.includes('sky sports')) return 'Sky Sports';
    if (lowerSubject.includes('sky news')) return 'Sky News';
    if (lowerSubject.includes('sky atlantic')) return 'Sky Atlantic';
    if (lowerSubject.includes('sky cinema')) return 'Sky Cinema';
    if (lowerSubject.includes('sky one')) return 'Sky One';
    if (lowerSubject.includes('sky two')) return 'Sky Two';
    return 'Sky';
  }
  
  // UKTV channels
  if (supplier === 'UKTV') {
    if (lowerSubject.includes('dave')) return 'Dave';
    if (lowerSubject.includes('gold')) return 'Gold';
    if (lowerSubject.includes('w')) return 'W';
    if (lowerSubject.includes('drama')) return 'Drama';
    if (lowerSubject.includes('yesterday')) return 'Yesterday';
    return 'UKTV';
  }
  
  // Discovery channels
  if (supplier === 'Discovery') {
    if (lowerSubject.includes('discovery channel')) return 'Discovery Channel';
    if (lowerSubject.includes('animal planet')) return 'Animal Planet';
    if (lowerSubject.includes('tlc')) return 'TLC';
    if (lowerSubject.includes('investigation discovery')) return 'Investigation Discovery';
    return 'Discovery';
  }
  
  return supplier;
}

// Identify email type from subject and body
export function identifyEmailType(subject: string): 'schedule' | 'update' | 'press' | 'technical' | 'marketing' {
  const lowerSubject = subject.toLowerCase();
  // const lowerBody = bodyPreview?.toLowerCase() || ''; // Removed unused variable
  
  // Schedule indicators
  if (lowerSubject.includes('schedule') || lowerSubject.includes('programme guide') || 
      lowerSubject.includes('tv guide') || lowerSubject.includes('lineup')) {
    return 'schedule';
  }
  
  // Update indicators
  if (lowerSubject.includes('update') || lowerSubject.includes('change') || 
      lowerSubject.includes('urgent') || lowerSubject.includes('last minute')) {
    return 'update';
  }
  
  // Press indicators
  if (lowerSubject.includes('press') || lowerSubject.includes('news') || 
      lowerSubject.includes('announcement') || lowerSubject.includes('release')) {
    return 'press';
  }
  
  // Technical indicators
  if (lowerSubject.includes('technical') || lowerSubject.includes('spec') || 
      lowerSubject.includes('broadcast') || lowerSubject.includes('transmission')) {
    return 'technical';
  }
  
  // Marketing indicators
  if (lowerSubject.includes('marketing') || lowerSubject.includes('promo') || 
      lowerSubject.includes('trailer') || lowerSubject.includes('campaign')) {
    return 'marketing';
  }
  
  // Default to schedule for most TV-related emails
  return 'schedule';
}