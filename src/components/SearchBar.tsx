'use client';

import { useState } from 'react';
import { Search, X, History, Filter } from 'lucide-react';
import { SearchOptions } from '@/types/email';

interface SearchBarProps {
  onSearch: (options: SearchOptions) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search emails..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchFields, setSearchFields] = useState<('subject' | 'from' | 'body')[]>(['subject', 'from']);
  const [exactMatch, setExactMatch] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'BBC schedule',
    'ITV update',
    'Channel 4 press',
    'Sky sports'
  ]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      const searchOptions: SearchOptions = {
        query: searchQuery.trim(),
        fields: searchFields,
        exact: exactMatch
      };
      
      onSearch(searchOptions);
      
      // Add to recent searches
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch({ query: '', fields: searchFields, exact: exactMatch });
  };

  const toggleSearchField = (field: 'subject' | 'from' | 'body') => {
    setSearchFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const isSearchEmpty = query.trim() === '';

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
            {!isSearchEmpty && (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`text-gray-400 hover:text-gray-600 ${isAdvancedOpen ? 'text-blue-600' : ''}`}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Advanced Search Options */}
        {isAdvancedOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search in:
              </label>
              <div className="space-y-2">
                {[
                  { key: 'subject', label: 'Subject' },
                  { key: 'from', label: 'From' },
                  { key: 'body', label: 'Body' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={searchFields.includes(key as 'subject' | 'from' | 'body')}
                      onChange={() => toggleSearchField(key as 'subject' | 'from' | 'body')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exactMatch}
                  onChange={(e) => setExactMatch(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Exact match</span>
              </label>
            </div>

            <div>
              <button
                onClick={() => handleSearch()}
                disabled={isSearchEmpty}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && !isAdvancedOpen && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <History className="inline h-4 w-4 mr-1" />
              Recent searches
            </label>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Tips */}
        <div className="mt-4 text-xs text-gray-500">
          <p>
            <strong>Tips:</strong> Use quotes for exact phrases, OR for alternatives, NOT to exclude terms.
          </p>
          <p className="mt-1">
            Examples: &quot;BBC schedule&quot;, &quot;ITV OR Channel 4&quot;, &quot;update NOT press&quot;
          </p>
        </div>
      </div>
    </div>
  );
}