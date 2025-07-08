import { Email } from '@/types/email';

export const mockEmails: Email[] = [
  {
    id: 'msg_001',
    subject: 'BBC One Schedule - Week 28',
    from: 'schedules@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC One',
    type: 'schedule',
    hasAttachments: true,
    receivedDateTime: '2025-07-08T09:00:00Z',
    categories: ['TV Schedule', 'BBC'],
    isRead: false,
    isFlagged: false,
    attachments: [
      {
        id: 'att_001',
        name: 'BBC_One_Schedule_Week28.pdf',
        contentType: 'application/pdf',
        size: 2048576
      }
    ]
  },
  {
    id: 'msg_002',
    subject: 'ITV Schedule Update - Tonight\'s Programming',
    from: 'updates@itv.com',
    supplier: 'ITV',
    channel: 'ITV1',
    type: 'update',
    hasAttachments: false,
    receivedDateTime: '2025-07-08T14:30:00Z',
    categories: ['Schedule Update', 'ITV'],
    isRead: true,
    isFlagged: false
  },
  {
    id: 'msg_003',
    subject: 'Channel 4 News - Special Report Tonight',
    from: 'newsdesk@channel4.com',
    supplier: 'Channel 4',
    channel: 'Channel 4',
    type: 'press',
    hasAttachments: true,
    receivedDateTime: '2025-07-08T16:15:00Z',
    categories: ['Press Release', 'Channel 4'],
    isRead: false,
    isFlagged: true,
    attachments: [
      {
        id: 'att_002',
        name: 'Special_Report_Press_Kit.zip',
        contentType: 'application/zip',
        size: 15728640
      }
    ]
  },
  {
    id: 'msg_004',
    subject: 'Sky Sports Premier League Schedule',
    from: 'sports@sky.com',
    supplier: 'Sky',
    channel: 'Sky Sports',
    type: 'schedule',
    hasAttachments: true,
    receivedDateTime: '2025-07-08T11:20:00Z',
    categories: ['TV Schedule', 'Sky', 'Sports'],
    isRead: true,
    isFlagged: false,
    attachments: [
      {
        id: 'att_003',
        name: 'Premier_League_Schedule.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1048576
      }
    ]
  },
  {
    id: 'msg_005',
    subject: 'UKTV Dave Comedy Schedule Updates',
    from: 'programming@uktv.co.uk',
    supplier: 'UKTV',
    channel: 'Dave',
    type: 'update',
    hasAttachments: false,
    receivedDateTime: '2025-07-08T13:45:00Z',
    categories: ['Schedule Update', 'UKTV'],
    isRead: false,
    isFlagged: false
  },
  {
    id: 'msg_006',
    subject: 'Discovery Channel - Planet Earth III Technical Specs',
    from: 'technical@discovery.com',
    supplier: 'Discovery',
    channel: 'Discovery Channel',
    type: 'technical',
    hasAttachments: true,
    receivedDateTime: '2025-07-08T08:30:00Z',
    categories: ['Technical', 'Discovery'],
    isRead: true,
    isFlagged: false,
    attachments: [
      {
        id: 'att_004',
        name: 'Planet_Earth_III_Tech_Specs.pdf',
        contentType: 'application/pdf',
        size: 3145728
      }
    ]
  },
  {
    id: 'msg_007',
    subject: 'BBC Two Documentary Series - Marketing Materials',
    from: 'marketing@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC Two',
    type: 'marketing',
    hasAttachments: true,
    receivedDateTime: '2025-07-08T10:15:00Z',
    categories: ['Marketing', 'BBC'],
    isRead: false,
    isFlagged: false,
    attachments: [
      {
        id: 'att_005',
        name: 'Documentary_Marketing_Kit.zip',
        contentType: 'application/zip',
        size: 25165824
      }
    ]
  },
  {
    id: 'msg_008',
    subject: 'ITV2 Reality Show Schedule - Love Island Updates',
    from: 'reality@itv.com',
    supplier: 'ITV',
    channel: 'ITV2',
    type: 'schedule',
    hasAttachments: false,
    receivedDateTime: '2025-07-08T17:00:00Z',
    categories: ['TV Schedule', 'ITV', 'Reality'],
    isRead: true,
    isFlagged: true
  },
  {
    id: 'msg_009',
    subject: 'Sky Atlantic Drama Series - House of the Dragon Press',
    from: 'press@sky.com',
    supplier: 'Sky',
    channel: 'Sky Atlantic',
    type: 'press',
    hasAttachments: true,
    receivedDateTime: '2025-07-08T12:00:00Z',
    categories: ['Press Release', 'Sky', 'Drama'],
    isRead: false,
    isFlagged: false,
    attachments: [
      {
        id: 'att_006',
        name: 'House_of_Dragon_Press_Release.pdf',
        contentType: 'application/pdf',
        size: 4194304
      }
    ]
  },
  {
    id: 'msg_010',
    subject: 'Channel 4 Film Schedule - Weekend Programming',
    from: 'films@channel4.com',
    supplier: 'Channel 4',
    channel: 'Channel 4',
    type: 'schedule',
    hasAttachments: true,
    receivedDateTime: '2025-07-08T15:30:00Z',
    categories: ['TV Schedule', 'Channel 4', 'Films'],
    isRead: true,
    isFlagged: false,
    attachments: [
      {
        id: 'att_007',
        name: 'Weekend_Film_Schedule.pdf',
        contentType: 'application/pdf',
        size: 1572864
      }
    ]
  }
];

export const supplierConfig = {
  'BBC': {
    color: 'bg-red-100 text-red-800',
    domains: ['bbc.co.uk', 'bbc.com']
  },
  'ITV': {
    color: 'bg-blue-100 text-blue-800',
    domains: ['itv.com', 'itv.co.uk']
  },
  'Channel 4': {
    color: 'bg-purple-100 text-purple-800',
    domains: ['channel4.com', 'c4.co.uk']
  },
  'Sky': {
    color: 'bg-gray-100 text-gray-800',
    domains: ['sky.com', 'sky.uk']
  },
  'UKTV': {
    color: 'bg-green-100 text-green-800',
    domains: ['uktv.co.uk']
  },
  'Discovery': {
    color: 'bg-yellow-100 text-yellow-800',
    domains: ['discovery.com', 'discovery.co.uk']
  }
};

export const typeConfig = {
  'schedule': {
    color: 'bg-blue-100 text-blue-800',
    label: 'Schedule'
  },
  'update': {
    color: 'bg-orange-100 text-orange-800',
    label: 'Update'
  },
  'press': {
    color: 'bg-green-100 text-green-800',
    label: 'Press'
  },
  'technical': {
    color: 'bg-gray-100 text-gray-800',
    label: 'Technical'
  },
  'marketing': {
    color: 'bg-purple-100 text-purple-800',
    label: 'Marketing'
  }
};