# Excel Data Conversion Instructions

## Current Email Data Structure

Each email needs these fields:

```typescript
{
  id: string;                    // Unique identifier (e.g., 'msg_001')
  subject: string;               // Email subject line
  from: string;                  // Email sender address
  supplier: string;              // TV channel/supplier (BBC, ITV, etc.)
  channel: string;               // Specific channel (BBC One, ITV1, etc.)
  type: 'schedule' | 'update' | 'press' | 'technical' | 'marketing';
  hasAttachments: boolean;       // true/false
  receivedDateTime: string;      // ISO string format
  categories: string[];          // Array of category strings
  body?: string;                 // Optional email body content
  attachments?: Attachment[];    // Optional attachments array
  isRead?: boolean;              // Optional read status
  isFlagged?: boolean;           // Optional flagged status
  isDuplicate?: boolean;         // Optional duplicate status
}
```

## Steps to Convert Excel Data

1. **Export Excel to CSV or JSON**
   - Save your Excel file as CSV or copy the data

2. **Map Excel columns to our format**
   - Map each column in your Excel to the fields above
   - Generate unique IDs for each email
   - Convert dates to ISO format
   - Parse categories into arrays

3. **Paste converted data below**
   - I'll help you format it properly for the mock data

## Example Format

```javascript
{
  id: 'msg_001',
  subject: 'BBC One Schedule Change - Tonight',
  from: 'schedule@bbc.co.uk',
  supplier: 'BBC',
  channel: 'BBC One',
  type: 'update',
  hasAttachments: false,
  receivedDateTime: '2024-01-15T14:30:00Z',
  categories: ['Schedule Update', 'BBC'],
  isRead: false,
  isFlagged: false
}
```

## What to do next

1. Share the Excel column headers with me
2. Provide a sample of the data (5-10 rows)
3. I'll create the proper mock data structure for you