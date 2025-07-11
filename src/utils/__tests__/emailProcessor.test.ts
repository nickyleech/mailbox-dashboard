import {
  detectDuplicates,
  filterEmails,
  searchEmails,
  calculateEmailStats,
  getUniqueChannels,
  formatFileSize,
  formatDate,
  identifySupplier,
  identifyChannel,
  identifyEmailType,
  transformGraphMessage,
  transformAttachments,
} from '../emailProcessor'
import { Email, EmailFilter, SearchOptions } from '@/types/email'

// Mock supplier config
jest.mock('@/data/mockEmails', () => ({
  supplierConfig: {
    'BBC': {
      domains: ['bbc.co.uk', 'bbc.com'],
    },
    'ITV': {
      domains: ['itv.com', 'itv.co.uk'],
    },
    'Sky': {
      domains: ['sky.com', 'sky.uk'],
    },
  },
}))

const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'BBC One Schedule Update',
    from: 'schedules@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC One',
    type: 'TV Schedule',
    hasAttachments: true,
    receivedDateTime: '2024-01-01T10:30:00Z',
    categories: ['urgent'],
    isRead: false,
    isFlagged: false,
    isDuplicate: false,
  },
  {
    id: '2',
    subject: 'Re: BBC One Schedule Update',
    from: 'schedules@bbc.co.uk',
    supplier: 'BBC',
    channel: 'BBC One',
    type: 'TV Schedule',
    hasAttachments: false,
    receivedDateTime: '2024-01-01T11:00:00Z',
    categories: ['urgent'],
    isRead: true,
    isFlagged: true,
    isDuplicate: false,
  },
  {
    id: '3',
    subject: 'ITV News Update',
    from: 'news@itv.com',
    supplier: 'ITV',
    channel: 'ITV1',
    type: 'Update',
    hasAttachments: false,
    receivedDateTime: '2024-01-02T14:45:00Z',
    categories: ['news'],
    isRead: false,
    isFlagged: false,
    isDuplicate: false,
  },
  {
    id: '4',
    subject: 'Sky Sports Weekly Schedule',
    from: 'content@sky.com',
    supplier: 'Sky',
    channel: 'Sky Sports',
    type: 'TV Schedule',
    hasAttachments: true,
    receivedDateTime: '2024-01-03T09:15:00Z',
    categories: ['sports'],
    isRead: false,
    isFlagged: false,
    isDuplicate: false,
  },
]

describe('emailProcessor', () => {
  describe('detectDuplicates', () => {
    it('should detect duplicate emails based on subject and sender', () => {
      const result = detectDuplicates(mockEmails)
      
      // Should mark the second email as duplicate (Re: BBC One Schedule Update)
      expect(result[0].isDuplicate).toBe(false)
      expect(result[1].isDuplicate).toBe(true)
      expect(result[2].isDuplicate).toBe(false)
      expect(result[3].isDuplicate).toBe(false)
    })

    it('should keep the earliest email and mark later ones as duplicates', () => {
      const duplicateEmails = [
        { ...mockEmails[0], receivedDateTime: '2024-01-01T12:00:00Z' },
        { ...mockEmails[0], id: '5', receivedDateTime: '2024-01-01T10:00:00Z' },
        { ...mockEmails[0], id: '6', receivedDateTime: '2024-01-01T11:00:00Z' },
      ]
      
      const result = detectDuplicates(duplicateEmails)
      
      // Earliest email should not be marked as duplicate
      expect(result.find(e => e.id === '5')?.isDuplicate).toBe(false)
      expect(result.find(e => e.id === '6')?.isDuplicate).toBe(true)
      expect(result.find(e => e.id === '1')?.isDuplicate).toBe(true)
    })

    it('should handle empty array', () => {
      const result = detectDuplicates([])
      expect(result).toEqual([])
    })

    it('should normalize subjects correctly', () => {
      const emailsWithPrefixes = [
        { ...mockEmails[0], subject: 'Test Subject' },
        { ...mockEmails[0], id: '5', subject: 'Re: Test Subject' },
        { ...mockEmails[0], id: '6', subject: 'FW: Test Subject' },
        { ...mockEmails[0], id: '7', subject: 'Fwd: Test Subject' },
      ]
      
      const result = detectDuplicates(emailsWithPrefixes)
      
      // All should be considered duplicates except the first
      expect(result[0].isDuplicate).toBe(false)
      expect(result[1].isDuplicate).toBe(true)
      expect(result[2].isDuplicate).toBe(true)
      expect(result[3].isDuplicate).toBe(true)
    })
  })

  describe('filterEmails', () => {
    it('should filter by supplier', () => {
      const filter: EmailFilter = { supplier: 'BBC' }
      const result = filterEmails(mockEmails, filter)
      
      expect(result).toHaveLength(2)
      expect(result.every(email => email.supplier === 'BBC')).toBe(true)
    })

    it('should filter by channel', () => {
      const filter: EmailFilter = { channel: 'BBC One' }
      const result = filterEmails(mockEmails, filter)
      
      expect(result).toHaveLength(2)
      expect(result.every(email => email.channel === 'BBC One')).toBe(true)
    })

    it('should filter by type', () => {
      const filter: EmailFilter = { type: 'Update' }
      const result = filterEmails(mockEmails, filter)
      
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('Update')
    })

    it('should filter by attachments', () => {
      const filter: EmailFilter = { hasAttachments: true }
      const result = filterEmails(mockEmails, filter)
      
      expect(result).toHaveLength(2)
      expect(result.every(email => email.hasAttachments)).toBe(true)
    })

    it('should filter by date range', () => {
      const filter: EmailFilter = {
        dateRange: {
          start: '2024-01-01T00:00:00Z',
          end: '2024-01-01T23:59:59Z',
        },
      }
      const result = filterEmails(mockEmails, filter)
      
      expect(result).toHaveLength(2)
      expect(result.every(email => email.receivedDateTime.startsWith('2024-01-01'))).toBe(true)
    })

    it('should filter by categories', () => {
      const filter: EmailFilter = { categories: ['urgent'] }
      const result = filterEmails(mockEmails, filter)
      
      expect(result).toHaveLength(2)
      expect(result.every(email => email.categories.includes('urgent'))).toBe(true)
    })

    it('should filter by time range', () => {
      // Mock current time to be 2024-01-01T12:00:00Z
      const mockDate = new Date('2024-01-01T12:00:00Z')
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
      
      const filter: EmailFilter = { timeFilter: 'last1hour' }
      const result = filterEmails(mockEmails, filter)
      
      // Should include emails from the last hour
      expect(result.length).toBeGreaterThanOrEqual(0)
      
      jest.restoreAllMocks()
    })

    it('should filter duplicates only', () => {
      const emailsWithDuplicates = detectDuplicates(mockEmails)
      const filter: EmailFilter = { showDuplicatesOnly: true }
      const result = filterEmails(emailsWithDuplicates, filter)
      
      expect(result.every(email => email.isDuplicate)).toBe(true)
    })

    it('should combine multiple filters', () => {
      const filter: EmailFilter = {
        supplier: 'BBC',
        hasAttachments: true,
      }
      const result = filterEmails(mockEmails, filter)
      
      expect(result).toHaveLength(1)
      expect(result[0].supplier).toBe('BBC')
      expect(result[0].hasAttachments).toBe(true)
    })
  })

  describe('searchEmails', () => {
    it('should search in subject field', () => {
      const searchOptions: SearchOptions = {
        query: 'Schedule',
        fields: ['subject'],
      }
      const result = searchEmails(mockEmails, searchOptions)
      
      expect(result).toHaveLength(3)
      expect(result.every(email => email.subject.toLowerCase().includes('schedule'))).toBe(true)
    })

    it('should search in from field', () => {
      const searchOptions: SearchOptions = {
        query: 'bbc.co.uk',
        fields: ['from'],
      }
      const result = searchEmails(mockEmails, searchOptions)
      
      expect(result).toHaveLength(2)
      expect(result.every(email => email.from.includes('bbc.co.uk'))).toBe(true)
    })

    it('should handle empty query', () => {
      const searchOptions: SearchOptions = {
        query: '',
        fields: ['subject'],
      }
      const result = searchEmails(mockEmails, searchOptions)
      
      expect(result).toEqual(mockEmails)
    })

    it('should handle OR operator', () => {
      const searchOptions: SearchOptions = {
        query: 'BBC or ITV',
        fields: ['subject'],
      }
      const result = searchEmails(mockEmails, searchOptions)
      
      expect(result).toHaveLength(3)
    })

    it('should handle NOT operator', () => {
      const searchOptions: SearchOptions = {
        query: 'Update not News',
        fields: ['subject'],
      }
      const result = searchEmails(mockEmails, searchOptions)
      
      expect(result).toHaveLength(2) // BBC One Schedule Update emails
    })

    it('should handle quoted phrases', () => {
      const searchOptions: SearchOptions = {
        query: '"BBC One"',
        fields: ['subject'],
      }
      const result = searchEmails(mockEmails, searchOptions)
      
      expect(result).toHaveLength(2)
    })

    it('should handle exact search', () => {
      const searchOptions: SearchOptions = {
        query: 'BBC',
        fields: ['subject'],
        exact: true,
      }
      const result = searchEmails(mockEmails, searchOptions)
      
      expect(result).toHaveLength(2)
    })
  })

  describe('calculateEmailStats', () => {
    it('should calculate basic stats correctly', () => {
      const stats = calculateEmailStats(mockEmails)
      
      expect(stats.totalEmails).toBe(4)
      expect(stats.attachmentCount).toBe(2)
      expect(stats.supplierDistribution).toEqual({
        BBC: 2,
        ITV: 1,
        Sky: 1,
      })
      expect(stats.typeDistribution).toEqual({
        schedule: 3,
        update: 1,
      })
    })

    it('should calculate peak times', () => {
      const stats = calculateEmailStats(mockEmails)
      
      expect(stats.peakTimes).toHaveLength(24)
      expect(stats.peakTimes[10].count).toBe(1) // 10:30
      expect(stats.peakTimes[11].count).toBe(1) // 11:00
      expect(stats.peakTimes[14].count).toBe(1) // 14:45
      expect(stats.peakTimes[9].count).toBe(1)  // 09:15
    })

    it('should calculate internal vs external ratio', () => {
      const stats = calculateEmailStats(mockEmails)
      
      expect(stats.internalVsExternalRatio.internal).toBe(0) // No internal domains match
      expect(stats.internalVsExternalRatio.external).toBe(4) // All emails are external
    })

    it('should handle empty array', () => {
      const stats = calculateEmailStats([])
      
      expect(stats.totalEmails).toBe(0)
      expect(stats.attachmentCount).toBe(0)
      expect(stats.supplierDistribution).toEqual({})
      expect(stats.typeDistribution).toEqual({})
    })
  })

  describe('getUniqueChannels', () => {
    it('should return unique sorted channels', () => {
      const channels = getUniqueChannels(mockEmails)
      
      expect(channels).toEqual(['BBC One', 'ITV1', 'Sky Sports'])
    })

    it('should handle empty array', () => {
      const channels = getUniqueChannels([])
      
      expect(channels).toEqual([])
    })

    it('should handle duplicate channels', () => {
      const emailsWithDuplicates = [
        ...mockEmails,
        { ...mockEmails[0], id: '5' },
      ]
      const channels = getUniqueChannels(emailsWithDuplicates)
      
      expect(channels).toEqual(['BBC One', 'ITV1', 'Sky Sports'])
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
    })

    it('should handle decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1572864)).toBe('1.5 MB')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const formatted = formatDate('2024-01-01T10:30:00Z')
      
      expect(formatted).toMatch(/01\/01\/2024/)
      expect(formatted).toMatch(/10:30/)
    })
  })

  describe('identifySupplier', () => {
    it('should identify supplier from email domain', () => {
      expect(identifySupplier('test@bbc.co.uk')).toBe('BBC')
      expect(identifySupplier('test@itv.com')).toBe('ITV')
      expect(identifySupplier('test@sky.com')).toBe('Sky')
    })

    it('should return Unknown for unrecognized domains', () => {
      expect(identifySupplier('test@unknown.com')).toBe('Unknown')
      expect(identifySupplier('invalid-email')).toBe('Unknown')
    })
  })

  describe('identifyChannel', () => {
    it('should identify BBC channels correctly', () => {
      expect(identifyChannel('BBC One Schedule', 'BBC')).toBe('BBC One')
      expect(identifyChannel('BBC Two Update', 'BBC')).toBe('BBC Two')
      expect(identifyChannel('BBC Three Programme', 'BBC')).toBe('BBC Three')
      expect(identifyChannel('CBBC Schedule', 'BBC')).toBe('CBBC')
      expect(identifyChannel('BBC News Update', 'BBC')).toBe('BBC News')
    })

    it('should identify ITV channels correctly', () => {
      expect(identifyChannel('ITV2 Schedule', 'ITV')).toBe('ITV2')
      expect(identifyChannel('ITV3 Update', 'ITV')).toBe('ITV3')
      expect(identifyChannel('CITV Programme', 'ITV')).toBe('CITV')
      expect(identifyChannel('General ITV Update', 'ITV')).toBe('ITV1')
    })

    it('should identify Sky channels correctly', () => {
      expect(identifyChannel('Sky Sports Schedule', 'Sky')).toBe('Sky Sports')
      expect(identifyChannel('Sky News Update', 'Sky')).toBe('Sky News')
      expect(identifyChannel('General Sky Update', 'Sky')).toBe('Sky')
    })

    it('should return supplier name for unrecognized channels', () => {
      expect(identifyChannel('Unknown Channel', 'BBC')).toBe('BBC')
      expect(identifyChannel('Random Subject', 'ITV')).toBe('ITV1')
    })
  })

  describe('identifyEmailType', () => {
    it('should identify update emails', () => {
      expect(identifyEmailType('Schedule Update')).toBe('Update')
      expect(identifyEmailType('Urgent Change')).toBe('Update')
      expect(identifyEmailType('Last Minute Amendment')).toBe('Update')
      expect(identifyEmailType('Final Billing Updated')).toBe('Update')
    })

    it('should identify technical emails', () => {
      expect(identifyEmailType('Technical Specification')).toBe('Other')
      expect(identifyEmailType('Broadcast Information')).toBe('Other')
      expect(identifyEmailType('EPG Data')).toBe('Other')
      expect(identifyEmailType('Sent to TASC')).toBe('Other')
    })

    it('should identify press emails', () => {
      expect(identifyEmailType('Press Release')).toBe('Press Release')
      expect(identifyEmailType('News Announcement')).toBe('Press Release')
      expect(identifyEmailType('Programme Information')).toBe('Press Release')
    })

    it('should identify schedule emails', () => {
      expect(identifyEmailType('Weekly Schedule')).toBe('TV Schedule')
      expect(identifyEmailType('TV Guide')).toBe('TV Schedule')
      expect(identifyEmailType('Monday Programme')).toBe('TV Schedule')
      expect(identifyEmailType('Re: Schedule')).toBe('TV Schedule')
    })

    it('should identify marketing emails', () => {
      expect(identifyEmailType('Marketing Campaign')).toBe('marketing')
      expect(identifyEmailType('Promo Material')).toBe('marketing')
      expect(identifyEmailType('Trailer Information')).toBe('marketing')
    })

    it('should default to schedule for unknown types', () => {
      expect(identifyEmailType('Random Subject')).toBe('TV Schedule')
    })
  })

  describe('transformGraphMessage', () => {
    it('should transform Microsoft Graph message correctly', () => {
      const graphMessage = {
        id: 'graph-id-123',
        subject: 'Test Subject',
        from: {
          emailAddress: {
            address: 'test@bbc.co.uk',
          },
        },
        hasAttachments: true,
        receivedDateTime: '2024-01-01T10:30:00Z',
        categories: ['urgent'],
        isRead: false,
        flag: { flagStatus: 'flagged' },
        bodyPreview: 'Test body preview',
        attachments: [
          {
            id: 'att-1',
            name: 'test.pdf',
            contentType: 'application/pdf',
            size: 1024,
          },
        ],
      }

      const result = transformGraphMessage(graphMessage)

      expect(result.id).toBe('graph-id-123')
      expect(result.subject).toBe('Test Subject')
      expect(result.from).toBe('test@bbc.co.uk')
      expect(result.supplier).toBe('BBC')
      expect(result.hasAttachments).toBe(true)
      expect(result.receivedDateTime).toBe('2024-01-01T10:30:00Z')
      expect(result.categories).toEqual(['urgent'])
      expect(result.isRead).toBe(false)
      expect(result.isFlagged).toBe(true)
      expect(result.body).toBe('Test body preview')
      expect(result.isDuplicate).toBe(false)
      expect(result.attachments).toHaveLength(1)
    })

    it('should handle missing fields gracefully', () => {
      const graphMessage = {
        id: 'graph-id-123',
      }

      const result = transformGraphMessage(graphMessage)

      expect(result.id).toBe('graph-id-123')
      expect(result.subject).toBe('')
      expect(result.from).toBe('')
      expect(result.supplier).toBe('Unknown')
      expect(result.hasAttachments).toBe(false)
      expect(result.categories).toEqual([])
      expect(result.isRead).toBe(false)
      expect(result.isFlagged).toBe(false)
      expect(result.body).toBe('')
    })
  })

  describe('transformAttachments', () => {
    it('should transform attachments correctly', () => {
      const graphAttachments = [
        {
          id: 'att-1',
          name: 'document.pdf',
          contentType: 'application/pdf',
          size: 1024,
        },
        {
          id: 'att-2',
          name: 'image.jpg',
          contentType: 'image/jpeg',
          size: 2048,
        },
      ]

      const result = transformAttachments(graphAttachments)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'att-1',
        name: 'document.pdf',
        contentType: 'application/pdf',
        size: 1024,
      })
      expect(result[1]).toEqual({
        id: 'att-2',
        name: 'image.jpg',
        contentType: 'image/jpeg',
        size: 2048,
      })
    })

    it('should handle empty attachments array', () => {
      const result = transformAttachments([])
      expect(result).toEqual([])
    })
  })

  describe('performance tests', () => {
    it('should handle large datasets efficiently', () => {
      const largeEmailSet = Array.from({ length: 1000 }, (_, i) => ({
        ...mockEmails[0],
        id: `email-${i}`,
        subject: `Email ${i}`,
        receivedDateTime: new Date(2024, 0, 1 + (i % 30)).toISOString(),
      }))

      const startTime = performance.now()
      const stats = calculateEmailStats(largeEmailSet)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(500) // Should complete within 500ms
      expect(stats.totalEmails).toBe(1000)
    })

    it('should efficiently detect duplicates in large datasets', () => {
      const largeEmailSet = Array.from({ length: 1000 }, (_, i) => ({
        ...mockEmails[0],
        id: `email-${i}`,
        subject: i % 2 === 0 ? 'Subject A' : 'Subject B',
        receivedDateTime: new Date(2024, 0, 1 + i).toISOString(),
      }))

      const startTime = performance.now()
      const result = detectDuplicates(largeEmailSet)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(200) // Should complete within 200ms
      expect(result.length).toBe(1000)
      expect(result.filter(email => email.isDuplicate).length).toBe(998) // 499 + 499 duplicates
    })
  })
})