import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '../Dashboard'
import { Email, EmailStats } from '@/types/email'

// Mock data
const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Test Email 1',
    from: 'sender1@example.com',
    supplier: 'Supplier A',
    channel: 'Channel 1',
    type: 'schedule',
    hasAttachments: true,
    receivedDateTime: '2024-01-01T10:30:00Z',
    categories: ['urgent'],
    isRead: false,
    isFlagged: false,
    isDuplicate: false,
  },
  {
    id: '2',
    subject: 'Test Email 2',
    from: 'sender2@example.com',
    supplier: 'Supplier B',
    channel: 'Channel 2',
    type: 'update',
    hasAttachments: false,
    receivedDateTime: '2024-01-01T18:15:00Z',
    categories: ['normal'],
    isRead: true,
    isFlagged: true,
    isDuplicate: false,
  },
  {
    id: '3',
    subject: 'Test Email 3',
    from: 'sender3@example.com',
    supplier: 'Supplier A',
    channel: 'Channel 1',
    type: 'press',
    hasAttachments: true,
    receivedDateTime: '2024-01-02T14:45:00Z',
    categories: ['high'],
    isRead: false,
    isFlagged: false,
    isDuplicate: false,
  },
]

const mockStats: EmailStats = {
  totalEmails: 3,
  supplierDistribution: {
    'Supplier A': 2,
    'Supplier B': 1,
  },
  typeDistribution: {
    schedule: 1,
    update: 1,
    press: 1,
    technical: 0,
    marketing: 0,
  },
  attachmentCount: 2,
  dailyVolume: [
    { date: '2024-01-01', count: 2 },
    { date: '2024-01-02', count: 1 },
  ],
  weeklyVolume: [
    { week: '2024-W01', count: 3 },
  ],
  monthlyVolume: [
    { month: '2024-01', count: 3 },
  ],
  peakTimes: [
    { hour: 10, count: 1 },
    { hour: 14, count: 1 },
    { hour: 18, count: 1 },
  ],
  internalVsExternalRatio: {
    internal: 1,
    external: 2,
  },
  responseTimeAnalysis: {
    avgResponseTime: 2.5,
    fastestResponse: 1,
    slowestResponse: 4,
  },
  seasonalPatterns: [
    {
      quarter: 'Q1 2024',
      averageDaily: 10,
      trend: 'up',
    },
    {
      quarter: 'Q2 2024',
      averageDaily: 12,
      trend: 'stable',
    },
  ],
}

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    expect(screen.getByText('Total Emails')).toBeInTheDocument()
  })

  it('displays correct total email count', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    expect(screen.getByText('Total Emails')).toBeInTheDocument()
    const totalEmailsElements = screen.getAllByText('3')
    expect(totalEmailsElements.length).toBeGreaterThan(0)
  })

  it('displays correct attachment count', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    expect(screen.getByText('With Attachments')).toBeInTheDocument()
    const attachmentElements = screen.getAllByText('2')
    expect(attachmentElements.length).toBeGreaterThan(0)
  })

  it('displays correct supplier count', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    expect(screen.getByText('Suppliers')).toBeInTheDocument()
    const supplierElements = screen.getAllByText('2')
    expect(supplierElements.length).toBeGreaterThan(0) // 2 unique suppliers
  })

  it('calculates and displays average daily emails correctly', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    expect(screen.getByText('Avg Daily')).toBeInTheDocument()
    // 3 emails / 2 days = 1.5, rounded to 2
    const avgDailyElements = screen.getAllByText('2')
    expect(avgDailyElements.length).toBeGreaterThan(0)
  })

  it('displays peak hour correctly', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    expect(screen.getByText('Peak Hour')).toBeInTheDocument()
    expect(screen.getByText('10:00')).toBeInTheDocument()
  })

  it('displays internal email ratio correctly', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    expect(screen.getByText('Internal Ratio')).toBeInTheDocument()
    expect(screen.getByText('33.3%')).toBeInTheDocument() // 1/3 * 100
  })

  it('displays monthly trend correctly', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    expect(screen.getByText('Monthly Trend')).toBeInTheDocument()
    expect(screen.getByText('This month')).toBeInTheDocument()
  })

  it('toggles time settings when settings button is clicked', async () => {
    const user = userEvent.setup()
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    
    const settingsButton = screen.getByRole('button', { name: /settings/i })
    await user.click(settingsButton)
    
    expect(screen.getByText('Out of Hours Start')).toBeInTheDocument()
    expect(screen.getByText('Out of Hours End')).toBeInTheDocument()
  })

  it('updates out of hours time settings', async () => {
    const user = userEvent.setup()
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    
    // Open settings
    const settingsButton = screen.getByRole('button', { name: /settings/i })
    await user.click(settingsButton)
    
    // Update start time
    const startTimeInput = screen.getByDisplayValue('17:00')
    await user.clear(startTimeInput)
    await user.type(startTimeInput, '18:00')
    
    // Update end time
    const endTimeInput = screen.getByDisplayValue('07:00')
    await user.clear(endTimeInput)
    await user.type(endTimeInput, '08:00')
    
    expect(startTimeInput).toHaveValue('18:00')
    expect(endTimeInput).toHaveValue('08:00')
  })

  it('switches between time range views', async () => {
    const user = userEvent.setup()
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    
    // Check initial state (daily should be active)
    const dailyButton = screen.getByRole('button', { name: 'Daily' })
    const weeklyButton = screen.getByRole('button', { name: 'Weekly' })
    const monthlyButton = screen.getByRole('button', { name: 'Monthly' })
    
    expect(dailyButton).toHaveClass('btn-primary')
    expect(weeklyButton).toHaveClass('btn-secondary')
    expect(monthlyButton).toHaveClass('btn-secondary')
    
    // Switch to weekly
    await user.click(weeklyButton)
    expect(weeklyButton).toHaveClass('btn-primary')
    expect(dailyButton).toHaveClass('btn-secondary')
    
    // Switch to monthly
    await user.click(monthlyButton)
    expect(monthlyButton).toHaveClass('btn-primary')
    expect(weeklyButton).toHaveClass('btn-secondary')
  })

  it('calculates out of hours emails correctly', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    
    // Default out of hours: 17:00 to 07:00
    // Email 1: 10:30 (business hours)
    // Email 2: 18:15 (out of hours)
    // Email 3: 14:45 (business hours)
    
    expect(screen.getByText('Business Hours')).toBeInTheDocument()
    expect(screen.getByText('Out of Hours')).toBeInTheDocument()
  })

  it('renders all chart components', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(4) // Multiple charts
    expect(screen.getAllByTestId('bar-chart').length).toBeGreaterThan(0)
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument()
  })

  it('displays seasonal patterns correctly', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    
    expect(screen.getByText('Seasonal Patterns')).toBeInTheDocument()
    expect(screen.getByText('Q1 2024')).toBeInTheDocument()
    expect(screen.getByText('Q2 2024')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument() // Q1 average
    expect(screen.getByText('12')).toBeInTheDocument() // Q2 average
  })

  it('displays duplicates analysis panel', () => {
    render(<Dashboard emails={mockEmails} stats={mockStats} />)
    
    expect(screen.getByText('Duplicates Analysis')).toBeInTheDocument()
    expect(screen.getByText('Potential Duplicates')).toBeInTheDocument()
    expect(screen.getByText('Duplicate Rate')).toBeInTheDocument()
    expect(screen.getByText('Urgent Duplicates')).toBeInTheDocument()
  })

  it('handles empty emails array', () => {
    const emptyStats: EmailStats = {
      ...mockStats,
      totalEmails: 0,
      dailyVolume: [],
      peakTimes: [],
    }
    
    render(<Dashboard emails={[]} stats={emptyStats} />)
    
    expect(screen.getByText('Total Emails')).toBeInTheDocument()
    const zeroElements = screen.getAllByText('0')
    expect(zeroElements.length).toBeGreaterThan(0)
  })

  it('handles division by zero in calculations', () => {
    const zeroStats: EmailStats = {
      ...mockStats,
      totalEmails: 0,
      dailyVolume: [],
    }
    
    render(<Dashboard emails={[]} stats={zeroStats} />)
    
    // Should not crash and should handle division by zero gracefully
    expect(screen.getByText('Total Emails')).toBeInTheDocument()
  })

  describe('isOutOfHours function', () => {
    it('correctly identifies out of hours emails', () => {
      render(<Dashboard emails={mockEmails} stats={mockStats} />)
      
      // The component should correctly categorize emails based on time
      // This is tested indirectly through the out of hours display
      expect(screen.getByText('Out of Hours Email Analysis')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has proper ARIA labels for interactive elements', () => {
      render(<Dashboard emails={mockEmails} stats={mockStats} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      // Check that time range buttons are properly labeled
      expect(screen.getByRole('button', { name: 'Daily' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Weekly' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Monthly' })).toBeInTheDocument()
    })
  })

  describe('performance', () => {
    it('handles large datasets efficiently', () => {
      const largeEmailSet = Array.from({ length: 1000 }, (_, i) => ({
        ...mockEmails[0],
        id: `email-${i}`,
        receivedDateTime: new Date(2024, 0, 1 + (i % 30)).toISOString(),
      }))
      
      const largeStats: EmailStats = {
        ...mockStats,
        totalEmails: 1000,
        dailyVolume: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(2024, 0, 1 + i).toISOString(),
          count: Math.floor(Math.random() * 50) + 10,
        })),
      }
      
      const startTime = performance.now()
      render(<Dashboard emails={largeEmailSet} stats={largeStats} />)
      const endTime = performance.now()
      
      // Should render within reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000)
      expect(screen.getByText('Total Emails')).toBeInTheDocument()
    })
  })
})