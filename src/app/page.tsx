'use client';

import { useState, useMemo } from 'react';
import { mockEmails } from '@/data/mockEmails';
import { EmailFilter, SearchOptions } from '@/types/email';
import { calculateEmailStats, getUniqueChannels } from '@/utils/emailProcessor';
import { useAuth } from '@/contexts/AuthContext';
import { useGraphEmails } from '@/hooks/useGraphEmails';
import EmailList from '@/components/EmailList';
import FilterPanel from '@/components/FilterPanel';
import SearchBar from '@/components/SearchBar';
import Dashboard from '@/components/Dashboard';
import ExportPanel from '@/components/ExportPanel';
import HelpSection from '@/components/HelpSection';
import LoginComponent from '@/components/LoginComponent';
import { Mail, BarChart3, Download, Filter, HelpCircle, RefreshCw, LogOut, User, AlertCircle } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState<EmailFilter>({});
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({ query: '', fields: ['subject', 'from'] });
  const [activeTab, setActiveTab] = useState<'emails' | 'dashboard' | 'export' | 'help'>('emails');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

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
    autoRefresh: true
  });

  // Fallback to mock data if needed
  const emails = useMemo(() => {
    if (!isAuthenticated || useMockData) {
      return mockEmails;
    }
    return graphEmails;
  }, [isAuthenticated, useMockData, graphEmails]);

  const filteredEmails = useMemo(() => {
    if (!isAuthenticated || useMockData) {
      return mockEmails;
    }
    return graphFilteredEmails;
  }, [isAuthenticated, useMockData, graphFilteredEmails]);

  const emailStats = useMemo(() => calculateEmailStats(filteredEmails), [filteredEmails]);
  const availableChannels = useMemo(() => getUniqueChannels(emails), [emails]);

  // Show login component if not authenticated
  if (!isAuthenticated && !authLoading) {
    return <LoginComponent />;
  }

  // Show loading state during authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'emails', label: 'Emails', icon: Mail, count: filteredEmails.length },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage your TV Schedule emails efficiently</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredEmails.length} of {emails.length} emails
              </div>
              
              {/* User info and controls */}
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600">
                  <User className="h-4 w-4 inline mr-1" />
                  {user?.name || user?.username || 'User'}
                </div>
                
                {/* Refresh button */}
                <button
                  onClick={refreshEmails}
                  disabled={graphLoading}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50"
                  title="Refresh emails"
                >
                  <RefreshCw className={`h-4 w-4 ${graphLoading ? 'animate-spin' : ''}`} />
                </button>
                
                {/* Toggle mock data */}
                <button
                  onClick={() => setUseMockData(!useMockData)}
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    useMockData 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {useMockData ? 'Mock Data' : 'Live Data'}
                </button>
                
                {/* Logout button */}
                <button
                  onClick={logout}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'emails' | 'dashboard' | 'export' | 'help')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-100 text-gray-900 rounded-full px-2 py-1 text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Error Display */}
      {graphError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{graphError}</p>
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
                onEmailClick={(email) => console.log('Email clicked:', email)}
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
    </div>
  );
}
