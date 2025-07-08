'use client';

import { useState, useMemo } from 'react';
import { mockEmails } from '@/data/mockEmails';
import { EmailFilter, SearchOptions } from '@/types/email';
import { filterEmails, searchEmails, calculateEmailStats, getUniqueChannels } from '@/utils/emailProcessor';
import EmailList from '@/components/EmailList';
import FilterPanel from '@/components/FilterPanel';
import SearchBar from '@/components/SearchBar';
import Dashboard from '@/components/Dashboard';
import ExportPanel from '@/components/ExportPanel';
import { Mail, BarChart3, Download, Filter } from 'lucide-react';

export default function Home() {
  const [emails] = useState(mockEmails);
  const [filters, setFilters] = useState<EmailFilter>({});
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({ query: '', fields: ['subject', 'from'] });
  const [activeTab, setActiveTab] = useState<'emails' | 'dashboard' | 'export'>('emails');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredEmails = useMemo(() => {
    let result = filterEmails(emails, filters);
    result = searchEmails(result, searchOptions);
    return result;
  }, [emails, filters, searchOptions]);

  const emailStats = useMemo(() => calculateEmailStats(filteredEmails), [filteredEmails]);
  const availableChannels = useMemo(() => getUniqueChannels(emails), [emails]);

  const tabs = [
    { id: 'emails', label: 'Emails', icon: Mail, count: filteredEmails.length },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'export', label: 'Export', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Dashboard</h1>
              <p className="text-gray-600">Manage your TV channel emails efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredEmails.length} of {emails.length} emails
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
                onClick={() => setActiveTab(tab.id as 'emails' | 'dashboard' | 'export')}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
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

          {/* Main Content Area */}
          <div className="lg:col-span-3">
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
          </div>
        </div>
      </div>
    </div>
  );
}
