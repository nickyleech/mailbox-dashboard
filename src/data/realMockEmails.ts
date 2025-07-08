import { Email } from '@/types/email';

const now = new Date();
const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

export const realMockEmails: Email[] = [
  {
    id: 'msg_001',
    subject: 'EXTERNAL:- BBC Week 22 - Saturday 31st May - Friday 6th June 2025',
    from: 'pressofficescotland@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC One Scotland',
    type: 'schedule',
    hasAttachments: false,
    receivedDateTime: thirtyMinAgo.toISOString(),
    categories: ['Schedule', 'BBC'],
    isRead: false,
    isFlagged: true,
    body: 'For the latest updates from across the BBC read What\'s Occurring? on LinkedIn\n\nBBC ONE SCOTLAND\nProgramme Information\n\n• Scotland\'s Home of the Year – The Final, Ep7\n\nBBC SCOTLAND\nProgramme Information\n\n• Lockerbie: Our Story'
  },
  {
    id: 'msg_002',
    subject: 'EXTERNAL:- EPG - Colors Cineplex Europe',
    from: 'epg.exporter@whatsonindia.com',
    supplier: 'Colors',
    channel: 'Colors Cineplex Europe',
    type: 'technical',
    hasAttachments: false,
    receivedDateTime: oneHourAgo.toISOString(),
    categories: ['EPG', 'Colors'],
    isRead: false,
    isFlagged: false,
    body: 'Hi,\n\nPlease find the latest schedules for the following channel(s)\nColors Cineplex Europe (Channel ID 8725)\nEPG has been generated for 05/01/25 00:00:00 to 06/01/25 00:00:00\n\nProduct ID 62926\nCust Code vmpl_fm1\nRegards'
  },
  {
    id: 'msg_003',
    subject: 'Re: [EXT] June Schedule Absolute',
    from: 'ricky.marshall@bauermedia.co.uk',
    supplier: 'Bauer Media',
    channel: 'Absolute Radio',
    type: 'schedule',
    hasAttachments: true,
    receivedDateTime: twoHoursAgo.toISOString(),
    categories: ['Schedule', 'Absolute Radio'],
    isRead: true,
    isFlagged: false,
    body: 'Hi there,\n\nPlease find the full Absolute Radio schedule for June attached.\n\nBest,\nRicky',
    attachments: [
      {
        id: 'att_001',
        name: 'Absolute_Radio_June_Schedule.pdf',
        contentType: 'application/pdf',
        size: 2048000
      }
    ]
  },
  {
    id: 'msg_004',
    subject: 'EXTERNAL:- BBC World Service UK Schedule - Wk24 - 2025-06-15 - Sunday',
    from: 'pressportal@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC World Service',
    type: 'schedule',
    hasAttachments: false,
    receivedDateTime: threeHoursAgo.toISOString(),
    categories: ['Schedule', 'BBC World Service'],
    isRead: false,
    isFlagged: false,
    body: 'BBC World Service UK Schedule\n15 Jun 2025\n\nWe welcome your feedback at presslistings@bbc.co.uk\n\n06:00-06:06\nBBC News\n\nThe latest five minute news bulletin from BBC World Service.\n\nRepeat No\nRelease Date 2025-06-15\nBrand Title BBC News'
  },
  {
    id: 'msg_005',
    subject: 'EXTERNAL:- BBC World Service UK Schedule - Wk24 - 2025-06-16 - Monday',
    from: 'pressportal@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC World Service',
    type: 'schedule',
    hasAttachments: false,
    receivedDateTime: threeHoursAgo.toISOString(),
    categories: ['Schedule', 'BBC World Service'],
    isRead: false,
    isFlagged: false,
    body: 'BBC World Service UK Schedule\n16 Jun 2025\n\nWe welcome your feedback at presslistings@bbc.co.uk\n\n06:00-06:06\nBBC News\n\nThe latest five minute news bulletin from BBC World Service.\n\nRepeat No\nRelease Date 2025-06-16\nBrand Title BBC News'
  },
  {
    id: 'msg_006',
    subject: 'EXTERNAL:- BBC ALBA SCHEDULE AMENDMENT WK 21 - FINAL (UPDATE 03)',
    from: 'margaret.taylor@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC Alba',
    type: 'update',
    hasAttachments: false,
    receivedDateTime: sixHoursAgo.toISOString(),
    categories: ['Update', 'BBC Alba'],
    isRead: true,
    isFlagged: true,
    body: 'Mon 26th @ 2200 & Thur 29th @ 2230 – Eorpa Billing added\n\nWed 28/05\n2300 – Ratharsair SAGR671Y/01 has been deleted and replaced by Mu Chriochan Hoil (Derick Thomson @ 100) SAGS052F/01\n\nMaggie\n\nMaggie Taylor\nHead of Publishing\nMG ALBA'
  },
  {
    id: 'msg_007',
    subject: 'EXTERNAL:- BBC ALBA SCHEDULE AMENDMENT WK 21 - FINAL (UPDATE 03)',
    from: 'pressportal@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC Alba',
    type: 'update',
    hasAttachments: false,
    receivedDateTime: sixHoursAgo.toISOString(),
    categories: ['Update', 'BBC Alba'],
    isRead: true,
    isFlagged: false,
    isDuplicate: true,
    body: 'Mon 26th @ 2200 & Thur 29th @ 2230 – Eorpa Billing added\n\nWed 28/05\n2300 – Ratharsair SAGR671Y/01 has been deleted and replaced by Mu Chriochan Hoil (Derick Thomson @ 100) SAGS052F/01\n\nMaggie\n\nMaggie Taylor\nHead of Publishing\nMG ALBA'
  },
  {
    id: 'msg_008',
    subject: 'EXTERNAL:- BBC Parliament - Update - Wednesday 21 May',
    from: 'rupert.farmer@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC Parliament',
    type: 'update',
    hasAttachments: false,
    receivedDateTime: twelveHoursAgo.toISOString(),
    categories: ['Update', 'BBC Parliament'],
    isRead: true,
    isFlagged: false,
    body: 'Updates in red\n\nBBC Parliament\n\nWednesday 21 May\n\n06:30 Treasury Questions\nCoverage of questions in the House of Commons to Rachel Reeves, the chancellor of the exchequer, and her team of ministers on Tuesday 20 May.\nNPAH568H/02 (R)'
  },
  {
    id: 'msg_009',
    subject: 'Ben.Spencer@pa.media sent MTV 80s. to TASC',
    from: 'Digital.Services@pamediagroup.com',
    supplier: 'PA Media',
    channel: 'MTV 80s',
    type: 'technical',
    hasAttachments: false,
    receivedDateTime: oneDayAgo.toISOString(),
    categories: ['Technical', 'MTV'],
    isRead: true,
    isFlagged: false,
    body: 'MTV 80s. was emailed to TASC'
  },
  {
    id: 'msg_010',
    subject: 'EXTERNAL:- BBC Scotland - wk 20 - billing update',
    from: 'gail.stevenson@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC Scotland',
    type: 'update',
    hasAttachments: false,
    receivedDateTime: oneDayAgo.toISOString(),
    categories: ['Update', 'BBC Scotland'],
    isRead: true,
    isFlagged: false,
    body: 'Please note:\n\nWednesday 21st May – BBC Scotland\n\n2100 Debate Night BILLING UPDATED\n\nDebate Night is coming from Dumfries with a studio audience putting questions to Emma Harper MSP from the SNP, Rachael Hamilton MSP from the Conservatives'
  }
];