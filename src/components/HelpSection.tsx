'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Search, Filter, BarChart3, Download, Forward, Clock, Settings, Paperclip, Eye, Copy, Tv, AlertTriangle } from 'lucide-react';

export default function HelpSection() {
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const helpSections = [
    {
      id: 'tv-schedule-overview',
      title: 'TV Schedule Dashboard Overview',
      icon: Tv,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <h4 className="font-semibold text-yellow-900">⚠️ TV Schedule Emails Only</h4>
            </div>
            <p className="text-yellow-800 text-sm">
              This application is specifically designed for managing TV programme schedule emails from broadcasters and suppliers. 
              It will <strong>NOT</strong> work with personal emails, business correspondence, or other types of emails.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📺 What This Dashboard Does:</h4>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Manages emails from the shared mailbox</li>
              <li>Categorizes emails by TV supplier (BBC, ITV, Channel 4, etc.)</li>
              <li>Filters by TV channel and programme type</li>
              <li>Detects duplicate schedule updates</li>
              <li>Provides analytics on TV schedule communications</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: 'Getting Started with TV Schedule Emails',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Welcome to your TV Schedule Email Dashboard! This specialized application helps you manage and organize TV programme schedule emails from broadcasters and suppliers.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Start:</h4>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Use the <strong>Emails</strong> tab to view TV schedule emails</li>
              <li>Check the <strong>Dashboard</strong> tab for TV schedule analytics</li>
              <li>Use the <strong>Export</strong> tab to download schedule data</li>
              <li>Filter by TV supplier, channel, programme type, or date range</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">📧 Shared Mailbox Access:</h4>
            <ul className="list-disc list-inside text-green-800 space-y-1">
              <li>Connected to the shared mailbox</li>
              <li>Requires delegate access permissions</li>
              <li>Automatically opens Outlook web interface after login</li>
              <li>Works alongside this dashboard for complete email management</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'email-management',
      title: 'TV Schedule Email Management',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Managing Your TV Schedule Emails</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Viewing Emails
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click on any TV schedule email row to view details</li>
                <li>• Unread schedule emails have a blue background</li>
                <li>• Flagged schedule emails show a red flag icon</li>
                <li>• Sort by date, channel, supplier, or programme type</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <Forward className="h-4 w-4 mr-2" />
                Email Actions
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>View:</strong> Open TV schedule email details</li>
                <li>• <strong>Forward:</strong> Forward schedule to team via email app</li>
                <li>• <strong>Archive:</strong> Move schedule email to archived folder</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'attachments',
      title: 'Attachments & Downloads',
      icon: Paperclip,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Working with TV Schedule Attachments</h4>
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Downloading Attachments
            </h5>
            <ul className="text-green-800 space-y-2">
              <li>• Click the download button next to any schedule attachment</li>
              <li>• File size is displayed in parentheses</li>
              <li>• Schedule files are downloaded to your default download folder</li>
              <li>• Common formats: PDF schedules, XLS programme lists, XML data</li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-medium text-yellow-900 mb-2">Tips:</h5>
            <ul className="text-yellow-800 space-y-1">
              <li>• Multiple attachments can be downloaded individually</li>
              <li>• Large files may take longer to download</li>
              <li>• Check your browser&apos;s download settings if issues occur</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'filtering-searching',
      title: 'Filtering & Searching',
      icon: Search,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Finding TV Schedule Emails Quickly</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search Function
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Search schedule subjects, broadcaster names, or email content</li>
                <li>• Use the search bar in the left sidebar</li>
                <li>• Search is case-insensitive</li>
                <li>• Results update in real-time as you type</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter Options
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>TV Supplier:</strong> BBC, ITV, Channel 4, Sky, etc.</li>
                <li>• <strong>TV Channel:</strong> Searchable dropdown for programme channels</li>
                <li>• <strong>Programme Type:</strong> Schedule, Update, Press Release, etc.</li>
                <li>• <strong>Time Range:</strong> Last 30 min, hour, 3h, 6h, 12h, 24h</li>
                <li>• <strong>Categories:</strong> TV Schedule, Drama, Sports, Films, etc.</li>
                <li>• <strong>Has Attachments:</strong> Show only schedule emails with files</li>
                <li>• <strong>Duplicates:</strong> Show only duplicate schedule emails</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'advanced-filtering',
      title: 'Advanced Filtering Features',
      icon: Filter,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">New Filtering Capabilities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Searchable Channel Dropdown</h5>
              <ul className="text-blue-800 space-y-1">
                <li>• Type to search through channel names</li>
                <li>• Keyboard navigation with arrow keys</li>
                <li>• Clear button to reset selection</li>
                <li>• Shows &quot;All channels&quot; when none selected</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Time-Based Filtering</h5>
              <ul className="text-green-800 space-y-1">
                <li>• <strong>Last 30 minutes:</strong> Most recent emails</li>
                <li>• <strong>Last 1 hour:</strong> Recent updates</li>
                <li>• <strong>Last 3/6/12 hours:</strong> Today&apos;s activity</li>
                <li>• <strong>Last 24 hours:</strong> Yesterday and today</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h5 className="font-medium text-orange-900 mb-2 flex items-center">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Detection
              </h5>
              <ul className="text-orange-800 space-y-1">
                <li>• Automatically detects similar emails</li>
                <li>• Based on subject line and sender</li>
                <li>• Ignores Re: and Fwd: prefixes</li>
                <li>• Highlights duplicates with orange border</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-medium text-yellow-900 mb-2">Pro Tips:</h5>
            <ul className="text-yellow-800 space-y-1">
              <li>• Time filters work with current time, not email dates</li>
              <li>• Combine time filters with other filters for precise results</li>
              <li>• Use time filters to quickly find recent urgent emails</li>
              <li>• Channel search is case-insensitive</li>
              <li>• Duplicate filter helps identify redundant emails</li>
              <li>• Original emails are kept, duplicates are marked</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'duplicate-detection',
      title: 'Duplicate Detection',
      icon: Copy,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Managing Duplicate Emails</h4>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h5 className="font-medium text-orange-900 mb-2">How Duplicates Are Detected</h5>
            <ul className="text-orange-800 space-y-2">
              <li>• Emails are compared by <strong>subject line</strong> and <strong>sender</strong></li>
              <li>• Reply and forward prefixes (Re:, Fwd:, etc.) are ignored</li>
              <li>• Whitespace differences are normalized</li>
              <li>• The <strong>earliest email</strong> is kept as the original</li>
              <li>• Later emails are marked as duplicates</li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Visual Indicators</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Orange border:</strong> Left border highlights duplicates</li>
                <li>• <strong>Orange background:</strong> Subtle background tint</li>
                <li>• <strong>Copy icon:</strong> Orange copy icon in status column</li>
                <li>• <strong>Tooltip:</strong> Hover for &quot;Duplicate email&quot; message</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Filter Options</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Show duplicates only:</strong> Filter to see just duplicates</li>
                <li>• <strong>Combine with other filters:</strong> Narrow down results</li>
                <li>• <strong>Time-based duplicates:</strong> Find recent duplicates</li>
                <li>• <strong>Channel-specific:</strong> Duplicates from specific channels</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Common Duplicate Scenarios</h5>
            <ul className="text-blue-800 space-y-1">
              <li>• Same schedule sent multiple times</li>
              <li>• Reply chains with similar subjects</li>
              <li>• Updates and corrections to original emails</li>
              <li>• Forwarded emails with same content</li>
              <li>• System-generated duplicate notifications</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard-analytics',
      title: 'Dashboard & Analytics',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Understanding Your Data</h4>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Summary Cards</h5>
              <ul className="text-blue-800 space-y-1">
                <li>• <strong>Total Emails:</strong> Total number of emails received</li>
                <li>• <strong>With Attachments:</strong> Count of emails containing files</li>
                <li>• <strong>Suppliers:</strong> Number of unique email suppliers</li>
                <li>• <strong>Avg Daily:</strong> Average emails received per day</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h5 className="font-medium text-red-900 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Out of Hours Analysis
              </h5>
              <ul className="text-red-800 space-y-1">
                <li>• View emails received outside business hours</li>
                <li>• Default range: 5pm to 7am (configurable)</li>
                <li>• Hourly breakdown shows peak email times</li>
                <li>• Click the settings icon to customize hours</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Daily Volume Chart</h5>
              <ul className="text-green-800 space-y-1">
                <li>• Shows email volume trends over time</li>
                <li>• Hover over bars for detailed counts</li>
                <li>• Helps identify busy periods</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'out-of-hours',
      title: 'Out of Hours Configuration',
      icon: Clock,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Configuring Business Hours</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              How to Configure
            </h5>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Go to the Dashboard tab</li>
              <li>Find the &quot;Out of Hours Email Analysis&quot; section</li>
              <li>Click the settings (gear) icon in the top right</li>
              <li>Set your &quot;Out of Hours Start&quot; time (default: 17:00)</li>
              <li>Set your &quot;Out of Hours End&quot; time (default: 07:00)</li>
              <li>The analysis will update automatically</li>
            </ol>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Understanding the Data</h5>
            <ul className="text-blue-800 space-y-1">
              <li>• <strong>Business Hours:</strong> Emails received during work hours</li>
              <li>• <strong>Out of Hours:</strong> Emails received outside work hours</li>
              <li>• <strong>Hourly Chart:</strong> Shows distribution across 24 hours</li>
              <li>• <strong>Statistics:</strong> Total count, percentage, and daily average</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'export-features',
      title: 'Export Features',
      icon: Download,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Exporting Your Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Export Options</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>CSV:</strong> Spreadsheet format</li>
                <li>• <strong>JSON:</strong> Developer-friendly format</li>
                <li>• <strong>Filtered Data:</strong> Export only filtered results</li>
                <li>• <strong>All Data:</strong> Export complete email list</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">How to Export</h5>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Go to the Export tab</li>
                <li>Apply any filters you want</li>
                <li>Choose your export format</li>
                <li>Click the download button</li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Common Issues & Solutions</h4>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Downloads Not Working</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check your browser&apos;s download settings</li>
                <li>• Ensure pop-ups are allowed for this site</li>
                <li>• Try a different browser</li>
                <li>• Clear your browser cache</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Email Forward Not Opening</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Set a default email application in your OS</li>
                <li>• Check if your email client is running</li>
                <li>• Try copying the email content manually</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Filters Not Working</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clear all filters and try again</li>
                <li>• Check date range settings</li>
                <li>• Refresh the page</li>
                <li>• Make sure search terms are spelled correctly</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const HelpSection = ({ section }: { section: typeof helpSections[0] }) => (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => toggleSection(section.id)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <section.icon className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-900">{section.title}</span>
        </div>
        {expandedSection === section.id ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {expandedSection === section.id && (
        <div className="px-6 pb-4 border-t border-gray-200">
          <div className="pt-4">
            {section.content}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">📺 TV Schedule Email Dashboard Help</h2>
          <p className="text-gray-600 mt-1">
            Learn how to use your specialized TV Schedule Email Dashboard effectively
          </p>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              ⚠️ TV Schedule Emails Only
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">📖 Quick Navigation</h3>
              <p className="text-blue-800 text-sm">
                Click on any section below to expand detailed instructions and tips. 
                Start with &quot;TV Schedule Dashboard Overview&quot; if you&apos;re new to the dashboard.
              </p>
            </div>
          </div>

          <div className="space-y-0">
            {helpSections.map((section) => (
              <HelpSection key={section.id} section={section} />
            ))}
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-2">Still Need Help?</h3>
            <p className="text-gray-600 text-sm">
              If you can&apos;t find what you&apos;re looking for in this help section, please contact your system administrator 
              or IT support team for additional assistance with the TV Schedule Email Dashboard.
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                📧 Remember: This tool only works with TV Schedule emails
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}