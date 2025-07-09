'use client';

import { useState, useMemo } from 'react';
import { mockEmails } from '@/data/mockEmails';
import { Email, EmailFilter, SearchOptions } from '@/types/email';
import { calculateEmailStats, getUniqueChannels, filterEmails, searchEmails, detectDuplicates } from '@/utils/emailProcessor';
import { useAuth } from '@/contexts/AuthContext';
import { useGraphEmails } from '@/hooks/useGraphEmails';
import EmailList from '@/components/EmailList';
import FilterPanel from '@/components/FilterPanel';
import SearchBar from '@/components/SearchBar';
import Dashboard from '@/components/Dashboard';
import ExportPanel from '@/components/ExportPanel';
import HelpSection from '@/components/HelpSection';
import LoginComponent from '@/components/LoginComponent';
import EmailPreviewPanel from '@/components/EmailPreviewPanel';
import { Mail, BarChart3, Download, HelpCircle } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState<EmailFilter>({});
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({ query: '', fields: ['subject', 'from'] });
  const [activeTab, setActiveTab] = useState<'emails' | 'dashboard' | 'export' | 'help'>('emails');
  const [isFilterOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [selectedMailbox] = useState('TV.Schedule@pamediagroup.com');
  const [previewEmail, setPreviewEmail] = useState<Email | null>(null);

  // Use Graph API or mock data based on authentication and user preference
  const { 
    emails: graphEmails, 
    filteredEmails: graphFilteredEmails, 
    loading: graphLoading, 
    error: graphError, 
    refreshEmails 
  } = useGraphEmails({
    filters,
    searchOptions,
    pageSize: 100,
    autoRefresh: true,
    mailboxId: selectedMailbox
  });

  // Fallback to mock data if needed
  const emails = useMemo(() => {
    if (!isAuthenticated || useMockData) {
      // Apply duplicate detection to mock data as well
      return detectDuplicates(mockEmails);
    }
    return graphEmails;
  }, [isAuthenticated, useMockData, graphEmails]);

  const filteredEmails = useMemo(() => {
    if (!isAuthenticated || useMockData) {
      // Apply filters to mock data as well
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
    }
    return graphFilteredEmails;
  }, [isAuthenticated, useMockData, graphFilteredEmails, filters, searchOptions, emails]);

  const emailStats = useMemo(() => calculateEmailStats(filteredEmails), [filteredEmails]);
  const availableChannels = useMemo(() => getUniqueChannels(emails), [emails]);

  // Show login component if not authenticated and not using demo mode
  if (!isAuthenticated && !authLoading && !useMockData) {
    return <LoginComponent onDemoMode={() => setUseMockData(true)} />;
  }

  // Show loading state during authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="h-12 w-12 border-2 border-gray-900 rounded mx-auto"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
          <p className="text-gray-900">Loading Dashboard...</p>
          <p className="text-sm text-gray-700 mt-1">Connecting to shared mailbox</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'emails', label: 'TV Schedule Emails', icon: Mail, count: filteredEmails.length },
    { id: 'dashboard', label: 'Analytics', icon: BarChart3 },
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Mailbox Dashboard</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900 border border-gray-300">
                    Shared Mailbox
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredEmails.length} of {emails.length} emails
              </div>
              
              {/* TV Schedule Status */}
              {isAuthenticated && (
                <div className="text-sm text-gray-900 font-medium">
                  Connected to TV Schedule Mailbox
                </div>
              )}
              
              {/* User info and controls */}
              <div className="flex items-center space-x-2">
                {isAuthenticated && (
                  <div className="text-sm text-gray-600">
                    {user?.name || user?.username || 'User'}
                  </div>
                )}
                
                {/* Refresh button - only show if authenticated and not in demo mode */}
                {isAuthenticated && !useMockData && (
                  <button
                    onClick={refreshEmails}
                    disabled={graphLoading}
                    className={`btn btn-ghost btn-sm p-2 ${graphLoading ? 'loading' : ''}`}
                    title="Refresh emails"
                  >
                    <div className={`h-4 w-4 border border-gray-900 rounded ${graphLoading ? 'animate-spin' : ''}`}></div>
                  </button>
                )}
                
                {/* Demo Mode Toggle */}
                <button
                  onClick={() => setUseMockData(!useMockData)}
                  className={`btn btn-sm ${
                    useMockData ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900 border border-gray-300'
                  }`}
                  title={useMockData ? 'Currently viewing sample TV schedule data' : 'Switch to demo mode'}
                >
                  {useMockData ? 'TV Schedule Demo' : 'Live TV Schedule'}
                </button>
                
                {/* Login/Logout button */}
                {isAuthenticated ? (
                  <button
                    onClick={logout}
                    className="btn btn-ghost btn-sm p-2"
                    title="Sign out"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => setUseMockData(false)}
                    className="btn btn-sm bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                    title="Sign in to access live data"
                  >
                    Sign In
                  </button>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'emails' | 'dashboard' | 'export' | 'help')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-100 text-gray-900 rounded-full px-2 py-1 text-xs border border-gray-300">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Demo Mode Banner */}
      {useMockData && (
        <div className="bg-gray-50 border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                    <div className="h-4 w-4 bg-gray-900 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    TV Schedule Demo Mode Active
                  </p>
                  <p className="text-xs text-gray-700">
                    Viewing sample TV schedule emails from BBC, ITV, Channel 4, and other broadcasters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {graphError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 border border-gray-900 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-900 font-medium">TV Schedule Email Access Error</p>
                <p className="text-sm text-gray-700 mt-1">{graphError}</p>
                <p className="text-xs text-gray-600 mt-2">
                  This dashboard only works with TV Schedule emails. Please ensure you have access to the shared mailbox.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          {activeTab !== 'help' && (
            <div className={`lg:col-span-1 space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
              <SearchBar onSearch={setSearchOptions} />
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                availableChannels={availableChannels}
                isOpen={true}
                onToggle={() => {}}
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className={`${activeTab === 'help' ? 'lg:col-span-4' : 'lg:col-span-3'}`}>
            {activeTab === 'emails' && (
              <EmailList
                emails={filteredEmails}
                onEmailClick={(email) => setPreviewEmail(email)}
                loading={graphLoading}
              />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard emails={filteredEmails} stats={emailStats} />
            )}

            {activeTab === 'export' && (
              <ExportPanel emails={emails} filteredEmails={filteredEmails} />
            )}

            {activeTab === 'help' && (
              <HelpSection />
            )}
          </div>
        </div>
      </div>

      {/* Email Preview Panel */}
      <EmailPreviewPanel
        email={previewEmail}
        onClose={() => setPreviewEmail(null)}
        onAction={(action, email) => {
          console.log('Email action:', action, email);
          // Handle actions like reply, forward, archive, delete
          if (action === 'reply') {
            // Open reply email
            window.location.href = `mailto:${email.from}?subject=Re: ${email.subject}`;
          } else if (action === 'forward') {
            // Open forward email
            window.location.href = `mailto:?subject=Fwd: ${email.subject}&body=${email.body || ''}`;
          }
          setPreviewEmail(null);
        }}
      />
    </div>
  );
}
